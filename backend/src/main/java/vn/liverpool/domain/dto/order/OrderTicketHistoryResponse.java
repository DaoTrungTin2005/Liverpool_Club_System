package vn.liverpool.domain.dto.order;

import java.time.LocalDateTime;

public record OrderTicketHistoryResponse(
     Long matchId,
    String paymentId,           // orderCode
    String timePayment,         // format: "dd/MM/yyyy HH:mm"
    String homeTeam,
    String homeLogo,            // URL hoặc path
    String awayTeam,
    String awayLogo,            // URL hoặc path
    String league,              // tournament name
    String timeDay,             // format: "dd/MM/yyyy"
    String timeHours,           // format: "HH:mm"
    String stadium,             // location
    Integer quantity,
    Long total,                 // totalPrice
    String status               // PAID, CANCELLED, PENDING

) {}