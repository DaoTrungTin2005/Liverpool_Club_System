package vn.liverpool.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.liverpool.validation.UniqueEmail;

// Nhận từ fe gửi sang khi đăng ký tài khoản
@Getter
@Setter
public class RegisterDTO {
    @NotBlank(message = "Full name is required")
    private String fullname;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @UniqueEmail(message = "Email already exists")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
