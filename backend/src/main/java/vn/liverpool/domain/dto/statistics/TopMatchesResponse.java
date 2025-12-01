package vn.liverpool.domain.dto.statistics;

import java.math.BigDecimal;
import java.util.List;

public record TopMatchesResponse(
        List<MatchSales> topMatches) {

    public record MatchSales(
            String matchName,
            Long ticketsSold,
            BigDecimal revenue) {
    }
}