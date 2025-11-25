// src/main/java/vn/liverpool/repository/CartItemRepository.java
package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.liverpool.domain.CartItem;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Method này bạn đang dùng trong CartService
    Optional<CartItem> findByCartIdAndProductIdAndVariantId(
            Long cartId, Long productId, Long variantId);

}