// src/main/java/vn/liverpool/domain/dto/player/ListPlayerFollowPositionResponse.java
package vn.liverpool.domain.dto.player;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ListPlayerFollowPositionResponse {
    private Long id;
    private String playerName;
    private Integer shirtNumber;
    private String bioImage; // URL đầy đủ
    private Integer totalMatches;
    private Integer totalGoals;
    private Integer totalAssists;
}