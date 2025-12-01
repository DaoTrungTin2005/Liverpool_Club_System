package vn.liverpool.domain.dto.order_ticket;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateOrderTicketRequest(

                @NotNull(message = "Match ID không được để trống") Long matchId,

                @NotNull(message = "Section ID không được để trống") Long sectionId,

                @NotBlank(message = "Tên khách hàng không được để trống") @Size(max = 100) String customerName,

                @NotBlank(message = "Email không được để trống") @Email(message = "Email không hợp lệ") String customerEmail,

                @NotBlank(message = "Số điện thoại không được để trống") @Pattern(regexp = "^(\\+84|0)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ") String customerPhone,

                @Size(max = 255, message = "Địa chỉ không quá 255 ký tự") String customerAddress, // ← Nullable

                @NotNull(message = "Số lượng vé không được để trống") @Min(value = 1, message = "Số lượng vé phải lớn hơn 0") Integer quantity,

                String note) {
}