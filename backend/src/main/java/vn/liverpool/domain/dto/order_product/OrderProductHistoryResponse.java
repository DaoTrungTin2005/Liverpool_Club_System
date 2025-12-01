package vn.liverpool.domain.dto.order_product;

import java.math.BigDecimal;
import java.util.List;

public record OrderProductHistoryResponse(
        Long orderId,
        String orderCode,
        String timePayment,
        List<OrderHistoryItem> items,
        BigDecimal totalPrice,
        BigDecimal shippingFee,
        String status) {
    public record OrderHistoryItem(
            String productName,
            String productImage,
            String size,
            Integer quantity,
            BigDecimal price,
            BigDecimal subtotal) {
    }
}