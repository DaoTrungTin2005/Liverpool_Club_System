package vn.liverpool.domain.dto.matches_and_tickets;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record  CreateMatchAndTicketRequest (
    String tournament,
    String homeTeam,
    String awayTeam,
    LocalDateTime matchDate,
    String location,
    List<TicketSettingRequest> ticketSettings
) {}

 record TicketSettingRequest(
    Long sectionId,
    int totalQuantity,
    BigDecimal price
){}