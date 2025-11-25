package vn.liverpool.domain.dto.product;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductResponse {

    private Long id;
    private String productName;
    private String type;
    private String bio;
    private String productImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<VariantResponse> variants;

    public ProductResponse(Long id, String productName, String type, String bio,
            String productImage, LocalDateTime createdAt,
            LocalDateTime updatedAt, List<VariantResponse> variants) {
        this.id = id;
        this.productName = productName;
        this.type = type;
        this.bio = bio;
        this.productImage = productImage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.variants = variants;
    }

    @Data
    public static class VariantResponse {
        private Long id;
        private String size;
        private BigDecimal price;
        private Integer quantity;
        private Integer soldQuantity;

        public VariantResponse(Long id, String size, BigDecimal price,
                Integer quantity, Integer soldQuantity) {
            this.id = id;
            this.size = size;
            this.price = price;
            this.quantity = quantity;
            this.soldQuantity = soldQuantity;
        }
    }
}