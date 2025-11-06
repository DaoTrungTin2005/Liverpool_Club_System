package vn.liverpool.domain.dto.matches_and_tickets;

import java.math.BigDecimal;

public record UpdateTicketRequest(
        Integer totalQuantity,
        BigDecimal price
) {}