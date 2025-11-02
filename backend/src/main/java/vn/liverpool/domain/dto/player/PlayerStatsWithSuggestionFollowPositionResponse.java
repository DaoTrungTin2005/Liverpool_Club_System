package vn.liverpool.domain.dto.player;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerStatsWithSuggestionFollowPositionResponse {
    // Thông tin cơ bản
    private Long id;
    private String playerName;
    private Integer shirtNumber;
    private String positionName;
    private String backgroundImage;
    
    // Stats tổng hợp (TOTAL)
    private Integer totalMatches;
    private Integer totalGoals;
    private Integer totalAssists;
    
    // Stats chi tiết theo từng giải
    private List<TournamentStats> tournamentStats;
    
    // Gợi ý cầu thủ cùng vị trí
    private List<SuggestedPlayer> otherPlayers;

    // Stats theo từng giải
    @Data
    @AllArgsConstructor
    public static class TournamentStats {
        private String tournamentName;  // CHAMPION LEAGUE, PREMIER LEAGUE, CARABAO CUP, FA CUP
        private Integer matches;
        private Integer goals;
        private Integer assists;
    }

    // Cầu thủ gợi ý
    @Data
    @AllArgsConstructor
    public static class SuggestedPlayer {
        private Long id;
        private String playerName;
        private Integer shirtNumber;
        private String bioImage;
        private Integer totalMatches;
        private Integer totalGoals;
        private Integer totalAssists;
    }
}