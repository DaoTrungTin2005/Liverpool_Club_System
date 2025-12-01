// File: ValidateSelectionRequest.java
package vn.liverpool.domain.dto.order_ticket;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ValidateSelectionRequest(

        @NotNull(message = "Match ID không được trống") Long matchId,

        @NotNull(message = "Section ID không được trống") Long sectionId,

        @NotNull(message = "Số lượng không được trống") @Min(value = 1, message = "Số lượng phải lớn hơn 0") Integer quantity

) {
}