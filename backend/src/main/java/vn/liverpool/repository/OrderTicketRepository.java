package vn.liverpool.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.liverpool.domain.Account;
import vn.liverpool.domain.OrderTicket;
import vn.liverpool.domain.OrderTicket.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderTicketRepository extends JpaRepository<OrderTicket, Long> {

    Optional<OrderTicket> findByOrderCode(String orderCode);

    Page<OrderTicket> findByStatus(OrderStatus status, Pageable pageable);

    Page<OrderTicket> findByCustomerEmailContaining(String email, Pageable pageable);

    List<OrderTicket> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime createdAt);

    @Query("""
              SELECT o FROM OrderTicket o
              WHERE :keyword IS NULL OR :keyword = '' OR
            LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(o.customerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(o.customerEmail) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(o.customerPhone) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(CAST(o.status AS string)) LIKE LOWER(CONCAT('%', :keyword, '%'))

              """)

    Page<OrderTicket> searchByKeyword(
            @Param("keyword") String keyword,
            Pageable pageable);

      @Query("""
        SELECT o
        FROM OrderTicket o
        WHERE o.account.id = :accountId
        ORDER BY o.createdAt DESC
    """)
    List<OrderTicket> findOrdersByAccountId(@Param("accountId") Long accountId);
}