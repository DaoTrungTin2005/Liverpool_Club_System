// src/main/java/vn/liverpool/domain/dto/UserListResponseDTO.java
package vn.liverpool.domain.dto;

import java.time.Instant;
import java.time.LocalDateTime;

public record UserListResponseDTO(
        Long id,
        String uid,
        String fullName,
        String email,
        String role,
        String status,
        Instant createdAt
) {}