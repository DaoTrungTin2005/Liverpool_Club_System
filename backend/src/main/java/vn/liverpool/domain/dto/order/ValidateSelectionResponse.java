// File: ValidateSelectionResponse.java
package vn.liverpool.domain.dto.order;

import java.math.BigDecimal;

public record ValidateSelectionResponse(

    Integer available,           // Số vé còn lại
    BigDecimal pricePerTicket,   // Giá mỗi vé
    BigDecimal totalPrice,       // Tổng tiền
    String sectionName,          // Tên khu vực (CE1 - Longside Lower Tier)
    String message               // Thông báo: "Còn 485 vé..."

) {}