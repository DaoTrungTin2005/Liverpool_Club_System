package vn.liverpool.domain.dto.matches_and_tickets;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record HomeMatchesGroupedResponse(
    LocalDateTime nextMatchDate, // thời gian trận đấu gần nhất để FE countdown
    Map<String, List<HomeMatchResponse>> matchesByTournament // group theo tournament
) {}