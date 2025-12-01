package vn.liverpool.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.liverpool.domain.dto.statistics.*;
import vn.liverpool.service.StatisticsService;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final StatisticsService statisticsService;

    // ========== 1. MONTHLY SALES PERFORMANCE ==========
    // GET /api/statistics/monthly-sales?year=2024
    @GetMapping("/monthly-sales")
    public ResponseEntity<MonthlySalesResponse> getMonthlySales(
            @RequestParam(required = false) Integer year) {

        MonthlySalesResponse response = statisticsService.getMonthlySales(year);
        return ResponseEntity.ok(response);
    }

    // ========== 2. SOLD AND UNSOLD TICKETS ==========
    // GET /api/statistics/ticket-status?matchId=5
    @GetMapping("/ticket-status")
    public ResponseEntity<TicketStatusResponse> getTicketStatus(
            @RequestParam(required = false) Long matchId) {

        TicketStatusResponse response = statisticsService.getTicketStatus(matchId);
        return ResponseEntity.ok(response);
    }

    // ========== 3. TOP 5 HIGHEST TICKET SALES ==========
    // GET /api/statistics/top-matches?month=12&year=2024
    @GetMapping("/top-matches")
    public ResponseEntity<TopMatchesResponse> getTopMatches(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        TopMatchesResponse response = statisticsService.getTopMatches(month, year);
        return ResponseEntity.ok(response);
    }
}