package vn.liverpool.domain.dto.matches_and_tickets;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CreateMatchAndTicketRequest(
    @NotBlank String tournament,
    @NotBlank String homeTeam,
    @NotBlank String awayTeam,
    @NotNull LocalDateTime matchDate,
    @NotBlank String location,
    @NotEmpty List<@Valid TicketSettingRequest> ticketSettings
) {}

record TicketSettingRequest(
    @NotNull Long sectionId,
    @Min(0) int totalQuantity,
    @NotNull @DecimalMin("0.00") BigDecimal price
) {}