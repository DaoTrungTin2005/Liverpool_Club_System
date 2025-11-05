package vn.liverpool.domain.dto.matches_and_tickets;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record TicketSettingRequest(
    @NotNull Long sectionId,
    @Min(0) Integer  totalQuantity,
    @DecimalMin("0.00") BigDecimal price
) {}
