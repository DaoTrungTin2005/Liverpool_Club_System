package vn.liverpool.domain.dto.matches_and_tickets;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ListMatchResponse(
        Long matchId,
        Long tournamentId,
        String homeTeam,
        String awayTeam,
        LocalDateTime matchDate,
        String location) {
}
