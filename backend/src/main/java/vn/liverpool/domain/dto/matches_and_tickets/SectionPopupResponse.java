package vn.liverpool.domain.dto.matches_and_tickets;

import java.math.BigDecimal;

public record SectionPopupResponse(
    String sectionName,       // "CE1"
    String tierName,          // "Longside Lower Tier"
    String stand,             // "Sir Kenny Dalglish Stand"
    String viewImageUrl,      // ảnh 3D góc nhìn
    BigDecimal price,         // $176.89
    Integer availableTickets
) {}