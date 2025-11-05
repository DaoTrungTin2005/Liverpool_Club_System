package vn.liverpool.domain.dto.matches_and_tickets;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CreateMatchAndTicketRequest(
    @NotNull Long tournamentId,
    @NotBlank String homeTeam,
    @NotBlank String awayTeam,
    @NotNull LocalDateTime matchDate,
    @NotBlank String location,
    @NotEmpty List<@Valid TicketSettingRequest> ticketSettings
) {}

