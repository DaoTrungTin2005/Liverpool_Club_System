package vn.liverpool.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.liverpool.domain.*;
import vn.liverpool.domain.OrderTicket.OrderStatus;
import vn.liverpool.domain.dto.order.CreateOrderTicketRequest;
import vn.liverpool.domain.dto.order.OrderTicketResponse;
import vn.liverpool.domain.dto.order.ValidateSelectionRequest;
import vn.liverpool.domain.dto.order.ValidateSelectionResponse;
import vn.liverpool.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderTicketService {

    private final OrderTicketRepository orderRepo;
    private final MatchRepository matchRepo;
    private final StadiumSectionRepository sectionRepo;
    private final TicketSettingRepository ticketSettingRepo;
    private final VNPayService vnPayService;
    private final MomoService momoService;
    private final ZaloPayService zaloPayService;
    private final HttpServletRequest request;
    private final UserContextService userContextService;

    // khi nhấn buy now ktra số lượng hợp lệ chưa
    public ValidateSelectionResponse validateSelection(ValidateSelectionRequest dto) {
        Match match = matchRepo.findById(dto.matchId())
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        StadiumSection section = sectionRepo.findById(dto.sectionId())
                .orElseThrow(() -> new IllegalArgumentException("Section not found"));

        TicketSetting setting = ticketSettingRepo
                .findByMatchIdAndSectionId(dto.matchId(), dto.sectionId())
                .orElseThrow(() -> new IllegalArgumentException("Seat isn't available"));

        int available = setting.getTotalQuantity() - setting.getSoldQuantity();
        if (dto.quantity() > available) {
            throw new IllegalArgumentException(
                    String.format("THERE ARE ONLY %d SEATS IN THIS SECTION", available));
        }

        BigDecimal totalPrice = setting.getPrice().multiply(BigDecimal.valueOf(dto.quantity()));

        return new ValidateSelectionResponse(
                available,
                setting.getPrice(),
                totalPrice,
                section.getName(),
                "THERE ARE " + available + " SEATS AVAILABLE"
                        + " ,SỐ LƯỢNG OK RỒI ĐÓ, HỢP LỆ ĐÓ, CHUYỂN QUA TRANG THANH TOÁN ĐI");
    }

    // ========== CREATE ORDER ==========
    @Transactional
    public OrderTicketResponse createOrder(CreateOrderTicketRequest dto) {
        Match match = matchRepo.findById(dto.matchId())
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + dto.matchId()));

        StadiumSection section = sectionRepo.findById(dto.sectionId())
                .orElseThrow(() -> new IllegalArgumentException("Section not found: " + dto.sectionId()));

        TicketSetting ticketSetting = ticketSettingRepo
                .findByMatchIdAndSectionId(dto.matchId(), dto.sectionId())
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found for this section"));

        Account currentAccount = userContextService.getCurrentAccount();
        if (currentAccount == null) {
            throw new IllegalArgumentException("You must be logged in to place an order.");
        }

        int totalQty = ticketSetting.getTotalQuantity();
        Integer soldQtyWrap = ticketSetting.getSoldQuantity();

        // Nếu soldQuantity là null thì đổi thành 0 để thui bị lỗi
        int soldQty = soldQtyWrap != null ? soldQtyWrap : 0;
        int available = totalQty - soldQty;

        if (dto.quantity() > available) {
            throw new IllegalArgumentException(
                    String.format("THERE ARE ONLY %d SEATS IN THIS SECTION", available));
        }

        BigDecimal totalPrice = ticketSetting.getPrice().multiply(BigDecimal.valueOf(dto.quantity()));
        String orderCode = generateOrderCode();

        // cập nhật sold_quantity (số lượng hiện có ở db + số lượng mới mua ròi cập nhật
        // vô db)
        ticketSetting.setSoldQuantity(soldQty + dto.quantity());
        ticketSettingRepo.save(ticketSetting);

        OrderTicket order = OrderTicket.builder()
                .match(match)
                .section(section)
                .customerName(dto.customerName())
                .customerEmail(dto.customerEmail())
                .customerPhone(dto.customerPhone())
                .customerAddress(dto.customerAddress())
                .quantity(dto.quantity())
                .totalPrice(totalPrice)
                .orderCode(orderCode)
                .status(OrderStatus.PENDING)
                .note(dto.note())
                .createdAt(LocalDateTime.now())
                .account(currentAccount)
                .build();

        OrderTicket savedOrder = orderRepo.save(order);

        String matchInfo = match.getHomeTeam() + " vs " + match.getAwayTeam();
        return new OrderTicketResponse(
                savedOrder.getId(),
                savedOrder.getOrderCode(),
                matchInfo,
                section.getName(),
                savedOrder.getCustomerName(),
                savedOrder.getCustomerEmail(),
                savedOrder.getCustomerPhone(),
                savedOrder.getCustomerAddress(),
                savedOrder.getQuantity(),
                savedOrder.getTotalPrice(),
                savedOrder.getStatus(),
                savedOrder.getCreatedAt(),
                currentAccount.getId(),
                currentAccount.getEmail());
    }

    // ========== VNPAY PAYMENT URL ==========
    @Transactional
    public String createVNPaymentUrl(Long orderId) {
        OrderTicket order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.PAID) {
            throw new IllegalStateException("Đơn hàng đã được thanh toán rồi!");
        } else if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Đơn hàng đã bị hủy!");
        }

        String matchInfo = order.getMatch().getHomeTeam() + " vs " + order.getMatch().getAwayTeam();
        String orderInfo = String.format("Thanh toan ve %s - %s", matchInfo, order.getSection().getName());
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
        OrderTicket order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.PAID) {
            throw new IllegalStateException("Đơn hàng đã được thanh toán rồi!");
        } else if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Đơn hàng đã bị hủy!");
        }

        String matchInfo = order.getMatch().getHomeTeam() + " vs " + order.getMatch().getAwayTeam();
        String orderInfo = String.format("Thanh toan ve %s - %s", matchInfo, order.getSection().getName());

        String paymentUrl = momoService.createPaymentUrl(
                order.getOrderCode(),
                order.getTotalPrice().longValue(),
                orderInfo);

        order.setPaymentType("MOMO");
        orderRepo.save(order);

        return paymentUrl;
    }

    // ========== ZALOPAY PAYMENT URL
    @Transactional
    public String createZaloPayPaymentUrl(Long orderId) {
        OrderTicket order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.PAID) {
            throw new IllegalStateException("Đơn hàng đã được thanh toán rồi!");
        } else if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Đơn hàng đã bị hủy!");
        }

        String matchInfo = order.getMatch().getHomeTeam() + " vs " + order.getMatch().getAwayTeam();
        String orderInfo = String.format("Thanh toan ve %s - %s", matchInfo, order.getSection().getName());

        String paymentUrl = zaloPayService.createPaymentUrl(
                order.getOrderCode(),
                order.getTotalPrice().longValue(),
                orderInfo);

        order.setPaymentType("ZALOPAY");
        orderRepo.save(order);

        return paymentUrl;
    }

    // ========== VNPAY CALLBACK ==========
    @Transactional
    public OrderTicketResponse handleVNPayReturn(java.util.Map<String, String> params) {
        boolean isValid = vnPayService.verifyPaymentSignature(params);
        if (!isValid) {
            throw new IllegalArgumentException("Chữ ký không hợp lệ!");
        }

        String orderCode = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");

        OrderTicket order = orderRepo.findByOrderCode(orderCode)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderCode));

        if ("00".equals(responseCode)) {
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
            order.setVnpayTransactionNo(transactionNo);
            order.setPaymentMethod(bankCode);

        } else {
            order.setStatus(OrderStatus.CANCELLED);
        }

        OrderTicket updatedOrder = orderRepo.save(order);
        return buildOrderResponse(updatedOrder);
    }

    // ========== MOMO CALLBACK ==========
    @Transactional
    public OrderTicketResponse handleMomoReturn(java.util.Map<String, String> params) {
        boolean isValid = momoService.verifySignature(params);
        if (!isValid) {
            throw new IllegalArgumentException("Chữ ký Momo không hợp lệ!");
        }

        String orderCode = params.get("orderId");
        String resultCode = params.get("resultCode");
        String transactionId = params.get("transId");

        OrderTicket order = orderRepo.findByOrderCode(orderCode)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderCode));

        if ("0".equals(resultCode)) {
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
            order.setMomoTransactionId(transactionId);
            order.setPaymentMethod("MOMO");

        } else {
            order.setStatus(OrderStatus.CANCELLED);
        }

        OrderTicket updatedOrder = orderRepo.save(order);
        return buildOrderResponse(updatedOrder);
    }

    // ========== ZALOPAY CALLBACK =========
    @Transactional
    public OrderTicketResponse handleZaloPayReturn(java.util.Map<String, String> params) {
        boolean isValid = zaloPayService.verifyPaymentSignature(params);
        if (!isValid) {
            throw new IllegalArgumentException("Chữ ký ZaloPay không hợp lệ!");
        }

        // ZaloPay trả về: app_trans_id, return_code (1 = success)
        String appTransId = params.get("app_trans_id");
        String returnCode = params.get("return_code");

        // Tìm order theo appTransId
        OrderTicket order = orderRepo.findAll().stream()
                .filter(o -> appTransId.equals(o.getZaloPayAppTransId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Order not found for ZaloPay trans: " + appTransId));

        if ("1".equals(returnCode)) {
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
            order.setPaymentMethod("ZALOPAY");

        } else {
            order.setStatus(OrderStatus.CANCELLED);
        }

        OrderTicket updatedOrder = orderRepo.save(order);
        return buildOrderResponse(updatedOrder);
    }

    // ========== HELPER METHODS ==========
    private OrderTicketResponse buildOrderResponse(OrderTicket order) {
        String matchInfo = order.getMatch().getHomeTeam() + " vs " + order.getMatch().getAwayTeam();

        Long accountId = order.getAccount() != null ? order.getAccount().getId() : null;
        String accountEmail = order.getAccount() != null ? order.getAccount().getEmail() : null;

        return new OrderTicketResponse(
                order.getId(),
                order.getOrderCode(),
                matchInfo,
                order.getSection().getName(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                order.getCustomerAddress(),
                order.getQuantity(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getCreatedAt(),
                accountId,
                accountEmail);
    }

    private String generateOrderCode() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "ORD" + timestamp + uuid;
    }

    private String getClientIP() {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    // SET THỜI GIAN HỦY ĐƠN HÀNG PENDING SAU 5 PHÚT ĐỒNG THỜI TRỪ SỐ LƯỢNG VÉ ĐÃ
    // ĐẶT TRONG ĐƠN HÀNG RA KHỎI SOLD_QUANTITY BẢNG TICKET_SETTINGS
    @Scheduled(fixedRate = 30000)
    @Transactional
    public void cancelExpiredPendingOrders() {
        LocalDateTime expireTime = LocalDateTime.now().minusMinutes(5); // 5 PHÚT

        // tìm các đơn hàng PEnding đã quá hạn
        List<OrderTicket> expiredOrders = orderRepo.findByStatusAndCreatedAtBefore(
                OrderStatus.PENDING, expireTime);

        // Lặp từng đơn để set cancelled
        for (OrderTicket order : expiredOrders) {
            order.setStatus(OrderStatus.CANCELLED);

            // tìm ticket_setting tương ứng để trừ số lượng vé đã đặt trong đơn hàng ra khỏi
            // sold_quantity
            TicketSetting setting = ticketSettingRepo
                    .findByMatchIdAndSectionId(order.getMatch().getId(), order.getSection().getId())
                    .orElse(null);

            if (setting != null) {
                int newSold = setting.getSoldQuantity() - order.getQuantity();
                setting.setSoldQuantity(Math.max(0, newSold)); // tránh âm
                ticketSettingRepo.save(setting);
            }

            orderRepo.save(order);
        }
    }

    // === LẤY DANH SÁCH ĐƠN HÀNG CHO ADMIN ===
    @Transactional(readOnly = true)
    public Page<OrderTicketResponse> getOrdersForAdmin(
            int page,
            int size,
            String keyword,
            String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        Page<OrderTicket> orderPage = (keyword == null || keyword.isBlank())
                ? orderRepo.findAll(pageable)
                : orderRepo.searchByKeyword(keyword, pageable);

        return orderPage.map(order -> new OrderTicketResponse(
                order.getId(),
                order.getOrderCode(),
                order.getMatch().getHomeTeam() + " vs " + order.getMatch().getAwayTeam(),
                order.getSection().getName(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                order.getCustomerAddress(),
                order.getQuantity(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getAccount() != null ? order.getAccount().getId() : null,
                order.getAccount() != null ? order.getAccount().getEmail() : null));
    }
}