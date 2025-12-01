package vn.liverpool.domain.dto.order_product;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// ===== REQUEST =====

public record CreateOrderProductRequest(
        @NotBlank(message = "Customer name is required") String customerName,

        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String customerEmail,

        @NotBlank(message = "Phone is required") @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone must be 10-11 digits") String customerPhone,

        @NotBlank(message = "Address is required") String customerAddress,

        String note,

        @NotEmpty(message = "Order must have at least one item") List<OrderItemDTO> items) {
    public record OrderItemDTO(
            @NotNull(message = "Product ID is required") Long productId,

            @NotNull(message = "Variant ID is required") Long variantId,

            @NotNull(message = "Quantity is required") @Min(value = 1, message = "Quantity must be at least 1") Integer quantity) {
    }
}
