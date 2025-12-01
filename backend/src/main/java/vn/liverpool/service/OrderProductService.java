
package vn.liverpool.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.liverpool.domain.*;
import vn.liverpool.domain.OrderProduct.OrderStatus;
import vn.liverpool.domain.dto.order_product.*;
import vn.liverpool.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderProductService {

    private final OrderProductRepository orderRepo;
    private final ProductRepository productRepo;
    private final ProductVariantRepository variantRepo;
    private final AccountRepository accountRepository;
    private final VNPayProductService vnPayService; // ← Service MỚI (cho product)
    private final MomoProductService momoService; // ← Service MỚI
    private final ZaloPayProductService zaloPayService; // ← Service MỚI
    private final HttpServletRequest request;
    private final UserContextService userContextService;

    // ========== CREATE ORDER ==========
    @Transactional
    public OrderProductResponse createOrder(CreateOrderProductRequest dto) {
        Account currentAccount = userContextService.getCurrentAccount();
        if (currentAccount == null) {
            throw new IllegalArgumentException("You must be logged in to place an order.");
        }

        // Tạo order
        OrderProduct order = OrderProduct.builder()
                .orderCode(generateOrderCode())
                .account(currentAccount)
                .customerName(dto.customerName())
                .customerEmail(dto.customerEmail())
                .customerPhone(dto.customerPhone())
                .customerAddress(dto.customerAddress())
                .note(dto.note())
                .status(OrderStatus.PENDING)
                .shippingFee(BigDecimal.ZERO)
                .totalPrice(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .build();

        BigDecimal totalPrice = BigDecimal.ZERO;

        // Xử lý từng item trong giỏ hàng
        for (CreateOrderProductRequest.OrderItemDTO itemDto : dto.items()) {
            Product product = productRepo.findById(itemDto.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemDto.productId()));

            ProductVariant variant = variantRepo.findById(itemDto.variantId())
                    .orElseThrow(() -> new IllegalArgumentException("Variant not found: " + itemDto.variantId()));

            // Kiểm tra số lượng tồn kho
            int available = variant.getQuantity() - (variant.getSoldQuantity() != null ? variant.getSoldQuantity() : 0);
            if (itemDto.quantity() > available) {
                throw new IllegalArgumentException(
                        String.format("Only %d items available for %s (Size: %s)",
                                available, product.getProductName(), variant.getSize()));
            }

            // Cập nhật sold quantity
            variant.setSoldQuantity(
                    (variant.getSoldQuantity() != null ? variant.getSoldQuantity() : 0) + itemDto.quantity());
            variantRepo.save(variant);

            // Tạo order item
            BigDecimal subtotal = variant.getPrice().multiply(BigDecimal.valueOf(itemDto.quantity()));
            totalPrice = totalPrice.add(subtotal);

            OrderProductItem orderItem = OrderProductItem.builder()
                    .order(order)
                    .product(product)
                    .variant(variant)
                    .quantity(itemDto.quantity())
                    .price(variant.getPrice())
                    .subtotal(subtotal)
                    .build();

            order.getOrderItems().add(orderItem);
        }

        order.setTotalPrice(totalPrice);
        OrderProduct savedOrder = orderRepo.save(order);

        return buildOrderResponse(savedOrder);
    }

    // ========== VNPAY PAYMENT URL ==========
    @Transactional
    public String createVNPaymentUrl(Long orderId) {
        OrderProduct order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.PAID) {
            throw new IllegalStateException("Đơn hàng đã được thanh toán rồi!");
        } else if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Đơn hàng đã bị hủy!");
        }

        String orderInfo = "Thanh toan don hang " + order.getOrderCode();
        String ipAddress = getClientIP();

        String paymentUrl = vnPayService.createPaymentUrl(
                order.getOrderCode(),
                order.getTotalPrice().longValue(),
                orderInfo,
                ipAddress);

        order.setPaymentType("VNPAY");
        orderRepo.save(order);

        return paymentUrl;
    }

    // ========== MOMO PAYMENT URL ==========
    @Transactional
    public String createMomoPaymentUrl(Long orderId) {
        OrderProduct order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.PAID) {
            throw new IllegalStateException("Đơn hàng đã được thanh toán rồi!");
        } else if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Đơn hàng đã bị hủy!");
        }

        String orderInfo = "Thanh toan don hang " + order.getOrderCode();

        String paymentUrl = momoService.createPaymentUrl(
                order.getOrderCode(),
                order.getTotalPrice().longValue(),
                orderInfo);

        order.setPaymentType("MOMO");
        orderRepo.save(order);

        return paymentUrl;
    }

    // ========== ZALOPAY PAYMENT URL ==========
    @Transactional
    public String createZaloPayPaymentUrl(Long orderId) {
        OrderProduct order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.PAID) {
            throw new IllegalStateException("Đơn hàng đã được thanh toán rồi!");
        } else if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Đơn hàng đã bị hủy!");
        }

        String orderInfo = "Thanh toan don hang " + order.getOrderCode();

        String paymentUrl = zaloPayService.createPaymentUrl(
                order.getOrderCode(),
                order.getTotalPrice().longValue(),
                orderInfo);

        order.setPaymentType("ZALOPAY");
        orderRepo.save(order);

        return paymentUrl;
    }

    // ========== VNPAY CALLBACK ==========
    // ========== VNPAY CALLBACK ==========
    @Transactional
    public OrderProductResponse handleVNPayReturn(Map<String, String> params) {
        log.info("🔍 Starting VNPay callback processing...");

        boolean isValid = vnPayService.verifyPaymentSignature(params);
        log.info("✔️ Signature valid: {}", isValid);

        if (!isValid) {
            log.error("❌ Invalid VNPay signature!");
            throw new IllegalArgumentException("Chữ ký không hợp lệ!");
        }

        String orderCode = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");

        log.info("📦 Order Code: {}", orderCode);
        log.info("💳 Response Code: {}", responseCode);
        log.info("🔢 Transaction No: {}", transactionNo);

        OrderProduct order = orderRepo.findByOrderCode(orderCode)
                .orElseThrow(() -> {
                    log.error("❌ Order not found: {}", orderCode);
                    return new IllegalArgumentException("Order not found: " + orderCode);
                });

        log.info("📋 Found order: {} - Current status: {}", order.getId(), order.getStatus());

        if ("00".equals(responseCode)) {
            log.info("✅ Payment SUCCESS");
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
            order.setVnpayTransactionNo(transactionNo);
            order.setPaymentMethod(bankCode);
        } else {
            log.warn("❌ Payment FAILED - Response code: {}", responseCode);
            order.setStatus(OrderStatus.CANCELLED);
            refundInventory(order);
        }

        OrderProduct updatedOrder = orderRepo.save(order);
        log.info("💾 Order saved with status: {}", updatedOrder.getStatus());

        return buildOrderResponse(updatedOrder);
    }

    // ========== MOMO CALLBACK ==========
    @Transactional
    public OrderProductResponse handleMomoReturn(Map<String, String> params) {
        boolean isValid = momoService.verifySignature(params);
        if (!isValid) {
            throw new IllegalArgumentException("Chữ ký Momo không hợp lệ!");
        }

        String orderCode = params.get("orderId");
        String resultCode = params.get("resultCode");
        String transactionId = params.get("transId");

        OrderProduct order = orderRepo.findByOrderCode(orderCode)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderCode));

        if ("0".equals(resultCode)) {
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
            order.setMomoTransactionId(transactionId);
            order.setPaymentMethod("MOMO");
        } else {
            order.setStatus(OrderStatus.CANCELLED);
            refundInventory(order);
        }

        OrderProduct updatedOrder = orderRepo.save(order);
        return buildOrderResponse(updatedOrder);
    }

    // ========== ZALOPAY CALLBACK ==========
    @Transactional
    public OrderProductResponse handleZaloPayReturn(Map<String, String> params) {
        boolean isValid = zaloPayService.verifyPaymentSignature(params);
        if (!isValid) {
            throw new IllegalArgumentException("Chữ ký ZaloPay không hợp lệ!");
        }

        String appTransId = params.get("app_trans_id");
        String returnCode = params.get("return_code");

        OrderProduct order = orderRepo.findAll().stream()
                .filter(o -> appTransId.equals(o.getZaloPayAppTransId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Order not found for ZaloPay trans: " + appTransId));

        if ("1".equals(returnCode)) {
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
            order.setPaymentMethod("ZALOPAY");
        } else {
            order.setStatus(OrderStatus.CANCELLED);
            refundInventory(order);
        }

        OrderProduct updatedOrder = orderRepo.save(order);
        return buildOrderResponse(updatedOrder);
    }

    // ========== AUTO CANCEL EXPIRED ORDERS ==========
    @Scheduled(fixedRate = 30000) // Chạy mỗi 30 giây
    @Transactional
    public void cancelExpiredPendingOrders() {
        LocalDateTime expireTime = LocalDateTime.now().minusMinutes(15);

        List<OrderProduct> expiredOrders = orderRepo.findByStatusAndCreatedAtBefore(
                OrderStatus.PENDING, expireTime);

        for (OrderProduct order : expiredOrders) {
            order.setStatus(OrderStatus.CANCELLED);
            refundInventory(order);
            orderRepo.save(order);
        }
    }

    // ========== HELPER METHODS ==========
    private OrderProductResponse buildOrderResponse(OrderProduct order) {
        String baseUrl = getBaseUrl() + "/uploads/products/";

        List<OrderProductResponse.OrderItemResponse> items = order.getOrderItems().stream()
                .map(item -> new OrderProductResponse.OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getProductName(),
                        item.getProduct().getProductImage() != null
                                ? baseUrl + item.getProduct().getProductImage()
                                : null,
                        item.getVariant().getId(),
                        item.getVariant().getSize(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getSubtotal()))
                .toList();

        return new OrderProductResponse(
                order.getId(),
                order.getOrderCode(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                order.getCustomerAddress(),
                items,
                order.getTotalPrice(),
                order.getShippingFee(),
                order.getStatus().toString(),
                order.getNote(),
                order.getCreatedAt(),
                order.getAccount() != null ? order.getAccount().getId() : null,
                order.getAccount() != null ? order.getAccount().getEmail() : null);
    }

    private void refundInventory(OrderProduct order) {
        for (OrderProductItem item : order.getOrderItems()) {
            ProductVariant variant = item.getVariant();
            int newSold = variant.getSoldQuantity() - item.getQuantity();
            variant.setSoldQuantity(Math.max(0, newSold));
            variantRepo.save(variant);
        }
    }

    private String generateOrderCode() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "SHOP" + timestamp + uuid;
    }

    private String getClientIP() {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private String getBaseUrl() {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }
}