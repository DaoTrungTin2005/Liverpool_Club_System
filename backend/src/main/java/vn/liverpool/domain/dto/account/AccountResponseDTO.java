package vn.liverpool.domain.dto.account;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

public record AccountResponseDTO(
    Long id,
    String fullname,
    String email,
    Instant createdAt,
    Instant updatedAt
) {}