package vn.liverpool.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.liverpool.domain.OrderTicket;
import vn.liverpool.domain.OrderTicket.OrderStatus;

import java.util.Optional;

@Repository
public interface OrderTicketRepository extends JpaRepository<OrderTicket, Long> {
    
    Optional<OrderTicket> findByOrderCode(String orderCode);
    
    Page<OrderTicket> findByStatus(OrderStatus status, Pageable pageable);
    
    Page<OrderTicket> findByCustomerEmailContaining(String email, Pageable pageable);
}