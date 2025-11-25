package vn.liverpool.domain.dto.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateCartItemRequest(
        @NotNull(message = "Cart Item not available") Long cartItemId,
        @Min(value = 1, message = "Quantity ≥ 1") Integer quantity) {
}