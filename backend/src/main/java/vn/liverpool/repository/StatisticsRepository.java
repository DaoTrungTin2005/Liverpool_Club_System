package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.liverpool.domain.OrderTicket;

import java.util.List;

@Repository
public interface StatisticsRepository extends JpaRepository<OrderTicket, Long> {

    // ========== 1. MONTHLY SALES ==========
    @Query("""
            SELECT FUNCTION('MONTH', o.paidAt) as month,
                   SUM(o.totalPrice) as totalSales
            FROM OrderTicket o
            WHERE o.status = 'PAID'
            AND FUNCTION('YEAR', o.paidAt) = :year
            GROUP BY FUNCTION('MONTH', o.paidAt)
            ORDER BY FUNCTION('MONTH', o.paidAt)
            """)
    List<Object[]> getMonthlySales(@Param("year") Integer year);

    // ========== 2. TICKET STATUS ==========
    // Tổng số vé (tất cả matches)
    @Query("SELECT SUM(ts.totalQuantity) FROM TicketSetting ts")
    Long sumTotalTickets();

    // Tổng số vé đã bán (tất cả matches)
    @Query("SELECT SUM(ts.soldQuantity) FROM TicketSetting ts")
    Long sumSoldTickets();

    // Tổng số vé theo match
    @Query("SELECT SUM(ts.totalQuantity) FROM TicketSetting ts WHERE ts.match.id = :matchId")
    Long sumTotalTicketsByMatch(@Param("matchId") Long matchId);

    // Tổng số vé đã bán theo match
    @Query("SELECT SUM(ts.soldQuantity) FROM TicketSetting ts WHERE ts.match.id = :matchId")
    Long sumSoldTicketsByMatch(@Param("matchId") Long matchId);

    // ========== 3. TOP 5 MATCHES ==========
    @Query("""
            SELECT CONCAT(o.match.homeTeam, ' vs ', o.match.awayTeam),
                   SUM(o.quantity) as ticketsSold,
                   SUM(o.totalPrice) as revenue
            FROM OrderTicket o
            WHERE o.status = 'PAID'
            GROUP BY o.match.id, o.match.homeTeam, o.match.awayTeam
            ORDER BY revenue DESC
            """)
    List<Object[]> getTopMatchesAllTime();

    @Query("""
            SELECT CONCAT(o.match.homeTeam, ' vs ', o.match.awayTeam),
                   SUM(o.quantity) as ticketsSold,
                   SUM(o.totalPrice) as revenue
            FROM OrderTicket o
            WHERE o.status = 'PAID'
            AND FUNCTION('MONTH', o.paidAt) = :month
            AND FUNCTION('YEAR', o.paidAt) = :year
            GROUP BY o.match.id, o.match.homeTeam, o.match.awayTeam
            ORDER BY revenue DESC
            """)
    List<Object[]> getTopMatchesByMonth(@Param("month") Integer month,
            @Param("year") Integer year);
}