package vn.liverpool.domain.dto.contact;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactMessageResponse {
    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private String content;
    private LocalDateTime createdAt;
}