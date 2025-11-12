package vn.liverpool.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.liverpool.domain.*;
import vn.liverpool.domain.OrderTicket.OrderStatus;
import vn.liverpool.domain.dto.order.CreateOrderTicketRequest;
import vn.liverpool.domain.dto.order.OrderTicketResponse;
import vn.liverpool.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderTicketService {

    private final OrderTicketRepository orderRepo;
    private final MatchRepository matchRepo;
    private final StadiumSectionRepository sectionRepo;
    private final TicketSettingRepository ticketSettingRepo;
    private final VNPayService vnPayService;
    private final HttpServletRequest request;

    @Transactional
    public OrderTicketResponse createOrder(CreateOrderTicketRequest dto) {
        // 1. Kiểm tra Match và Section
        Match match = matchRepo.findById(dto.matchId())
            .orElseThrow(() -> new IllegalArgumentException("Match not found: " + dto.matchId()));
        
        StadiumSection section = sectionRepo.findById(dto.sectionId())
            .orElseThrow(() -> new IllegalArgumentException("Section not found: " + dto.sectionId()));

        // 2. Lấy TicketSetting
        TicketSetting ticketSetting = ticketSettingRepo
            .findByMatchIdAndSectionId(dto.matchId(), dto.sectionId())
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vé cho khu vực này"));

        // 3. Kiểm tra số lượng vé còn lại
        int available = ticketSetting.getTotalQuantity() - ticketSetting.getSoldQuantity();
        if (dto.quantity() > available) {
            throw new IllegalArgumentException(
                String.format("Chỉ còn %d vé cho khu vực này. Bạn đang chọn %d vé.", available, dto.quantity())
            );
        }

        // 4. Tính tổng tiền
        BigDecimal totalPrice = ticketSetting.getPrice().multiply(BigDecimal.valueOf(dto.quantity()));

        // 5. Tạo mã đơn hàng unique
        String orderCode = generateOrderCode();

        // 6. Tạo OrderTicket
        OrderTicket order = OrderTicket.builder()
            .match(match)
            .section(section)
            .customerName(dto.customerName())
            .customerEmail(dto.customerEmail())
            .customerPhone(dto.customerPhone())
            .quantity(dto.quantity())
            .totalPrice(totalPrice)
            .orderCode(orderCode)
            .status(OrderStatus.PENDING)
            .note(dto.note())
            .createdAt(LocalDateTime.now())
            .build();

        OrderTicket savedOrder = orderRepo.save(order);

        // 7. Tạo URL thanh toán VNPay
        String matchInfo = match.getHomeTeam() + " vs " + match.getAwayTeam();
        String orderInfo = String.format("Thanh toan ve %s - %s", matchInfo, section.getName());
        String ipAddress = getClientIP();
        
        String paymentUrl = vnPayService.createPaymentUrl(
            orderCode,
            totalPrice.longValue(),
            orderInfo,
            ipAddress
        );

        // 8. Return response
        return new OrderTicketResponse(
            savedOrder.getId(),
            savedOrder.getOrderCode(),
            matchInfo,
            section.getName(),
            savedOrder.getCustomerName(),
            savedOrder.getCustomerEmail(),
            savedOrder.getCustomerPhone(),
            savedOrder.getQuantity(),
            savedOrder.getTotalPrice(),
            savedOrder.getStatus(),
            paymentUrl,
            savedOrder.getCreatedAt()
        );
    }

    @Transactional
    public OrderTicketResponse handleVNPayReturn(java.util.Map<String, String> params) {
        // 1. Verify chữ ký
        boolean isValid = vnPayService.verifyPaymentSignature(params);
        if (!isValid) {
            throw new IllegalArgumentException("Chữ ký không hợp lệ!");
        }

        // 2. Lấy thông tin từ params
        String orderCode = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");

        // 3. Tìm order
        OrderTicket order = orderRepo.findByOrderCode(orderCode)
            .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderCode));

        // 4. Xử lý theo response code
        if ("00".equals(responseCode)) {
            // Thanh toán thành công
            order.setStatus(OrderStatus.PAID);
            order.setPaidAt(LocalDateTime.now());
            order.setVnpayTransactionNo(transactionNo);
            order.setPaymentMethod(bankCode);

            // Cập nhật soldQuantity trong TicketSetting
            TicketSetting ticketSetting = ticketSettingRepo
                .findByMatchIdAndSectionId(order.getMatch().getId(), order.getSection().getId())
                .orElseThrow();
            
            ticketSetting.setSoldQuantity(ticketSetting.getSoldQuantity() + order.getQuantity());
            ticketSettingRepo.save(ticketSetting);
            
        } else {
            // Thanh toán thất bại
            order.setStatus(OrderStatus.FAILED);
        }

        OrderTicket updatedOrder = orderRepo.save(order);

        // 5. Return response
        String matchInfo = order.getMatch().getHomeTeam() + " vs " + order.getMatch().getAwayTeam();
        return new OrderTicketResponse(
            updatedOrder.getId(),
            updatedOrder.getOrderCode(),
            matchInfo,
            order.getSection().getName(),
            updatedOrder.getCustomerName(),
            updatedOrder.getCustomerEmail(),
            updatedOrder.getCustomerPhone(),
            updatedOrder.getQuantity(),
            updatedOrder.getTotalPrice(),
            updatedOrder.getStatus(),
            null,
            updatedOrder.getCreatedAt()
        );
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
}