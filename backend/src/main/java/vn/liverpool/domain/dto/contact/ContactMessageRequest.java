package vn.liverpool.domain.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactMessageRequest {

    @NotBlank(message = "Please enter your full name")
    private String fullName;

    @NotBlank(message = "Please enter your phone number")
    private String phone;

    @NotBlank(message = "Please enter your email")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Please enter the content")
    private String content;
}