package vn.liverpool.domain.dto.matches_and_tickets;

import java.time.LocalDateTime;

public record HomeMatchResponse(
    Long id,
    String tournamentName,
    String homeTeam,
    String awayTeam,
    String homeLogo,
    String awayLogo,
    String matchImage,
    LocalDateTime matchDate,
    String location
) {}