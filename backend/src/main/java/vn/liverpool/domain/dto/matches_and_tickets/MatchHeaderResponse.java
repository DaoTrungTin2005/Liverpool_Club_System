package vn.liverpool.domain.dto.matches_and_tickets;

import java.time.LocalDateTime;

public record MatchHeaderResponse(
    String tournamentName,
    String homeTeam,
    String awayTeam,
    String homeLogo,
    String awayLogo,
    String matchImage,
    LocalDateTime matchDate,     // FE tự format, tự ordinal, tự thêm "th" 
    String location
) {}