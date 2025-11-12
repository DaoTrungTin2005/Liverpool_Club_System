package vn.liverpool.domain.dto.order;

import vn.liverpool.domain.OrderTicket.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderTicketResponse(
    Long id,
    String orderCode,
    String matchInfo,
    String sectionName,
    String customerName,
    String customerEmail,
    String customerPhone,
    Integer quantity,
    BigDecimal totalPrice,
    OrderStatus status,
    String paymentUrl,  // URL thanh toán VNPay
    LocalDateTime createdAt
) {}