// File: ValidateSelectionRequest.java
package vn.liverpool.domain.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ValidateSelectionRequest(
    
    @NotNull(message = "Match ID không được để trống")
    Long matchId,

    @NotNull(message = "Section ID không được để trống")
    Long sectionId,

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    Integer quantity

) {}