package vn.liverpool.domain.dto.product;

import java.math.BigDecimal;

public record ProductListResponse(
                Long productId,
                Long variantId,
                String productName,
                String bio,
                BigDecimal price,
                Integer quantity,
                Integer soldQuantity,
                String type,
                String size,
                String image) {
}