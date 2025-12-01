package vn.liverpool.domain.dto.statistics;

import java.math.BigDecimal;
import java.util.List;

// DTO cho Monthly Sales Performance
public record MonthlySalesResponse(
        Integer year,
        List<MonthData> months) {

    public record MonthData(
            Integer month,
            String monthLabel, // T1, T2, T3...
            BigDecimal totalSales) {
    }
}