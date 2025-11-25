package vn.liverpool.domain.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        List<CartItemDto> items,
        int totalItems,
        BigDecimal shippingFee,
        BigDecimal totalPrice) {
}