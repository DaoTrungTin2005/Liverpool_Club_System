package vn.liverpool.domain.dto.matches_and_tickets;

import java.math.BigDecimal;

public record ListTicketResponse(
        String sectionName,        // VD: "Khu A - Hạng VIP"
        String matchDisplay,       // VD: "Liverpool vs Man City"
        Integer totalQuantity,
        Integer soldQuantity,
        BigDecimal price
) {}