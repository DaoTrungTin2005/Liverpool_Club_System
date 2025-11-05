package vn.liverpool.domain.dto.matches_and_tickets;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ViewMatchAndTicketResponse(
        Long matchId,
        String tournamentName,         // Trả về tên tournament luôn cho view
        String homeTeam,
        String awayTeam,
        String homeLogoUrl,
        String awayLogoUrl,
        String matchImageUrl,
        LocalDateTime matchDate,
        String location,
        List<TicketSettingResponse> ticketSettings
) {}
