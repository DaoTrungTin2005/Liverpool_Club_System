package vn.liverpool.domain.dto.matches_and_tickets;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CreateMatchAndTicketResponse(
    Long matchId,
    String tournament,
    String homeTeam,
    String awayTeam,
    String homeLogoUrl,
    String awayLogoUrl,
    LocalDateTime matchDate,
    String location,
    List<TicketSettingResponse> ticketSettings
) {}

record TicketSettingResponse(
    Long sectionId,
    String sectionName,
    String stand,
    String tierName,
    int totalQuantity,
    BigDecimal price
) {}