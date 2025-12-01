// File: ValidateSelectionResponse.java
package vn.liverpool.domain.dto.order_ticket;

import java.math.BigDecimal;

public record ValidateSelectionResponse(

                Integer available,
                BigDecimal pricePerTicket,
                BigDecimal totalPrice,
                String sectionName,
                String message

) {
}