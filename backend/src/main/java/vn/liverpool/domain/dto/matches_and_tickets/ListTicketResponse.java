// src/main/java/vn/liverpool/domain/dto/matches_and_tickets/ListTicketResponse.java
package vn.liverpool.domain.dto.matches_and_tickets;

import java.math.BigDecimal;

public record ListTicketResponse(
        Long ticketSettingId,        // BẮT BUỘC để update
        String sectionName,
        String matchDisplay,
        Integer totalQuantity,
        Integer soldQuantity,
        BigDecimal price
) {}