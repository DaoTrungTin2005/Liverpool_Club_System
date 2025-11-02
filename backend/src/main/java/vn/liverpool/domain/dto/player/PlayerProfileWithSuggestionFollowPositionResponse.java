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
public class PlayerProfileWithSuggestionFollowPositionResponse {
    private Long id;
    private String playerName;
    private String bio;
    private Integer shirtNumber;
    private String positionName;
    private String backgroundImage;
    private String bioImage;
    private LocalDate dateOfBirth;
    private String location;
    private String nationality;
    private LocalDate joinedClub;

    private List<SuggestedPlayer> otherPlayers;


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