package vn.liverpool.domain.dto.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddToCartRequest(
        @NotNull(message = "Please choose product") Long productId,
        @NotNull(message = "Please choose size") Long variantId,
        @Min(value = 1, message = "Quantity > 0") Integer quantity) {
}