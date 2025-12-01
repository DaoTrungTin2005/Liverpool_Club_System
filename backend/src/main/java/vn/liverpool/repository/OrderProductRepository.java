package vn.liverpool.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.liverpool.domain.OrderProduct;
import vn.liverpool.domain.OrderProduct.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {

    Optional<OrderProduct> findByOrderCode(String orderCode);

    List<OrderProduct> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime expireTime);

    @Query("SELECT o FROM OrderProduct o WHERE o.account.id = :accountId ORDER BY o.createdAt DESC")
    List<OrderProduct> findOrdersByAccountId(@Param("accountId") Long accountId);
}