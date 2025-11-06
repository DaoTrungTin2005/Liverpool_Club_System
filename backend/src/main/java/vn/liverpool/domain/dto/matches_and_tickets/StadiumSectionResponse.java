package vn.liverpool.domain.dto.matches_and_tickets;

// StadiumSectionResponse.java
public record StadiumSectionResponse(
        Long id,
        String name, // CE1, L3, 102, v.v.
        String stand, // Sir Kenny Dalglish Stand, The Kop, v.v.
        String tierName, // Longside Upper Tier, The Kop, v.v.
        String image // ce1.jpg
) {
}