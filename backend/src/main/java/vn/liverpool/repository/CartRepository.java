package vn.liverpool.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.liverpool.domain.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByAccountId(Long accountId);
}
