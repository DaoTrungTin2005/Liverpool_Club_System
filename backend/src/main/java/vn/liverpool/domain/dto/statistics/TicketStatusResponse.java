package vn.liverpool.domain.dto.statistics;

// DTO cho Sold/Unsold Tickets
public record TicketStatusResponse(
        Long totalTickets,
        Long soldTickets,
        Long unsoldTickets,
        Double soldPercentage,
        Double unsoldPercentage) {
}
