package vn.liverpool.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.liverpool.domain.dto.statistics.*;
import vn.liverpool.repository.StatisticsRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final StatisticsRepository statisticsRepository;

    // ========== 1. MONTHLY SALES PERFORMANCE ==========
    @Transactional(readOnly = true)
    public MonthlySalesResponse getMonthlySales(Integer year) {
        if (year == null) {
            year = LocalDateTime.now().getYear();
        }

        List<Object[]> results = statisticsRepository.getMonthlySales(year);

        // Khởi tạo 12 tháng với giá trị 0
        Map<Integer, BigDecimal> monthlySales = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            monthlySales.put(i, BigDecimal.ZERO);
        }

        // Fill data từ query
        for (Object[] row : results) {
            Integer month = (Integer) row[0];
            BigDecimal totalSales = (BigDecimal) row[1];
            monthlySales.put(month, totalSales);
        }

        // Tạo response
        String[] monthNames = { "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

        List<MonthlySalesResponse.MonthData> monthDataList = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            monthDataList.add(new MonthlySalesResponse.MonthData(
                    i,
                    monthNames[i - 1],
                    monthlySales.get(i)));
        }

        return new MonthlySalesResponse(year, monthDataList);
    }

    // ========== 2. SOLD AND UNSOLD TICKETS ==========
    @Transactional(readOnly = true)
    public TicketStatusResponse getTicketStatus(Long matchId) {
        Long totalTickets;
        Long soldTickets;

        if (matchId != null) {
            totalTickets = statisticsRepository.sumTotalTicketsByMatch(matchId);
            soldTickets = statisticsRepository.sumSoldTicketsByMatch(matchId);
        } else {
            totalTickets = statisticsRepository.sumTotalTickets();
            soldTickets = statisticsRepository.sumSoldTickets();
        }

        // Handle null cases
        totalTickets = (totalTickets != null) ? totalTickets : 0L;
        soldTickets = (soldTickets != null) ? soldTickets : 0L;

        Long unsoldTickets = totalTickets - soldTickets;

        double soldPercentage = totalTickets > 0
                ? (soldTickets * 100.0 / totalTickets)
                : 0.0;
        double unsoldPercentage = 100.0 - soldPercentage;

        return new TicketStatusResponse(
                totalTickets,
                soldTickets,
                unsoldTickets,
                Math.round(soldPercentage * 10) / 10.0,
                Math.round(unsoldPercentage * 10) / 10.0);
    }

    // ========== 3. TOP 5 HIGHEST TICKET SALES ==========
    @Transactional(readOnly = true)
    public TopMatchesResponse getTopMatches(Integer month, Integer year) {
        List<Object[]> results;

        // Nếu chỉ có month mà không có year, tự động lấy năm hiện tại
        if (month != null && year == null) {
            year = LocalDateTime.now().getYear();
        }

        if (month != null && year != null) {
            results = statisticsRepository.getTopMatchesByMonth(month, year);
        } else {
            results = statisticsRepository.getTopMatchesAllTime();
        }

        List<TopMatchesResponse.MatchSales> topMatches = results.stream()
                .limit(5)
                .map(row -> new TopMatchesResponse.MatchSales(
                        (String) row[0],
                        ((Number) row[1]).longValue(),
                        (BigDecimal) row[2]))
                .toList();

        return new TopMatchesResponse(topMatches);
    }
}