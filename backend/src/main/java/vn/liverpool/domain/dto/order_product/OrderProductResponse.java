package vn.liverpool.domain.dto.order_product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderProductResponse(
        Long orderId,
        String orderCode,
        String customerName,
        String customerEmail,
        String customerPhone,
        String customerAddress,
        List<OrderItemResponse> items,
        BigDecimal totalPrice,
        BigDecimal shippingFee,
        String status,
        String note,
        LocalDateTime createdAt,
        Long accountId,
        String accountEmail) {
    public record OrderItemResponse(
            Long productId,
            String productName,
            String productImage,
            Long variantId,
            String size,
            BigDecimal price,
            Integer quantity,
            BigDecimal subtotal) {
    }
}