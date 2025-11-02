package vn.liverpool.domain.dto.player;

import java.time.LocalDate;
import java.util.List;

public record PlayerDetailWithStatsResponseDTO(
                Long id,
                String playerName,
                String bio,
                Integer shirtNumber,
                String position,
                String backgroundImage,
                String bioImage,
                LocalDate dateOfBirth,
                String location,
                String nationality,
                LocalDate joinedClub,
                List<StatsDetail> stats) {
        public record StatsDetail(
                        String tournament,
                        Integer matches,
                        Integer goals,
                        Integer assists) {
        }
}