// src/main/java/vn/liverpool/domain/dto/UpdateUserByAdminDTO.java
package vn.liverpool.domain.dto;

import jakarta.validation.constraints.*;

public record UpdateUserByAdminDTO(
        @NotBlank(message = "Full name is required")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Role is required")
        @Pattern(regexp = "^(ADMIN|USER)$", message = "Role must be ADMIN or USER")
        String role

       // ko cho đổi pass
) {}