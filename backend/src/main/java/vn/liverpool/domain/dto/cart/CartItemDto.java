package vn.liverpool.domain.dto.cart;

import java.math.BigDecimal;

public record CartItemDto(
        Long cartItemId,
        Long productId,
        String productName,
        String productImage,
        Long variantId,
        String size,
        BigDecimal price,
        int quantity,
        int available,
        BigDecimal subtotal) {
}