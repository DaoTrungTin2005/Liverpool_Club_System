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
    String customerAddress,
    Integer quantity,
    BigDecimal totalPrice,
    OrderStatus status,
    LocalDateTime createdAt,
    Long accountId,
    String accountEmail
) {}