package vn.liverpool.domain.dto;

public record LoginResponse(
    String token,
    Long id,
    String email,
    String fullname,
    String role
) {}