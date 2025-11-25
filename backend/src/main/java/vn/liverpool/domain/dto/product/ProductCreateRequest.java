// src/main/java/vn/liverpool/dto/request/ProductCreateRequest.java
package vn.liverpool.domain.dto.product;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class ProductCreateRequest {

    @NotBlank(message = "Name of Product must enter")
    private String productName;

    @NotBlank(message = "Type of Product must enter")
    private String type;

    private String bio;

    private String productImage;

    @NotEmpty(message = "Enter at least 1 size")
    private List<VariantDTO> variants = new ArrayList<>();

    @Data
    public static class VariantDTO {
        @NotBlank(message = "Size of Product must enter")
        private String size;

        @NotNull(message = "Price of Product must enter")
        @Positive(message = "Price of product > 0")
        private BigDecimal price;

        @NotNull(message = "Quantity of product must enter")
        @Min(value = 0, message = "Quantity of product > 0")
        private Integer quantity;
    }
}