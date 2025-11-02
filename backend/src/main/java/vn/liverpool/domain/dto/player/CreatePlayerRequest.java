package vn.liverpool.domain.dto.player;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public record CreatePlayerRequest(
    
    @NotBlank(message = "Player name is required")
    @Size(max = 100, message = "Player name must not exceed 100 characters")
    String playerName,
    
    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    String bio,
    
    @NotNull(message = "Shirt number is required")
    @Min(value = 1, message = "Shirt number must be at least 1")
    @Max(value = 99, message = "Shirt number must not exceed 99")
    Integer shirtNumber,
    
    @NotNull(message = "Position is required")
    Long positionId,
    
    String backgroundImage,
    
    String bioImage,
    
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    LocalDate dateOfBirth,
    
    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location must not exceed 100 characters")
    String location,
    
    @NotBlank(message = "Nationality is required")
    @Size(max = 100, message = "Nationality must not exceed 100 characters")
    String nationality,
    
    @NotNull(message = "Joined club date is required")
    LocalDate joinedClub,
    
    @Valid
    List<CreatePlayerStatsRequest> stats
) {}