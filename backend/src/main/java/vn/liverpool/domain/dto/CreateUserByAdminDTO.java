package vn.liverpool.domain.dto;

import jakarta.validation.constraints.*;

public record CreateUserByAdminDTO(
    @NotBlank String fullName,
    @NotBlank @Email String email,
    @NotBlank String role,
    @NotBlank @Size(min = 6) String password
) {}