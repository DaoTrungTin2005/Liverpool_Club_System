package vn.liverpool.domain.dto.player;

import jakarta.validation.constraints.*;

public record CreatePlayerStatsRequest(
    
    @NotNull(message = "Tournament ID is required")
    Long tournamentId,
    
    @Min(value = 0, message = "Matches must be at least 0")
    Integer matches,
    
    @Min(value = 0, message = "Goals must be at least 0")
    Integer goals,
    
    @Min(value = 0, message = "Assists must be at least 0")
    Integer assists
) {}