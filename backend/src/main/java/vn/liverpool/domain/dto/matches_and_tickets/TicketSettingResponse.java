package vn.liverpool.domain.dto.matches_and_tickets;

import java.math.BigDecimal;

public record TicketSettingResponse(
    Long sectionId,
    String sectionName,
    String stand,
    String tierName,
    int totalQuantity,
    BigDecimal price
) {}
