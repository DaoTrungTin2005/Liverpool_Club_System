package vn.liverpool.repository;

import vn.liverpool.domain.Product;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("""
            SELECT DISTINCT p FROM Product p
            JOIN p.variants v
            WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(p.type) LIKE LOWER(CONCAT('%', :search, '%'))
               OR CAST(v.price AS string) LIKE CONCAT('%', :search, '%')
            """)
    Page<Product> searchProducts(@Param("search") String search, Pageable pageable);

    // Search + Filter by type + price range (không phân trang)
    // chỉ vô giá nhỏ nhất thì tìm từ nhỏ nhất đổ lên (>=)
    @Query("""
            SELECT DISTINCT p FROM Product p
            JOIN p.variants v
            WHERE (:search IS NULL OR :search = ''
                OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.type) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:type IS NULL OR :type = '' OR LOWER(p.type) = LOWER(:type))
            AND (:minPrice IS NULL OR v.price >= :minPrice)
            AND (:maxPrice IS NULL OR v.price <= :maxPrice)
            ORDER BY p.createdAt DESC
            """)

    // truyền tham số qua @param
    List<Product> searchProductsWithFilters(
            @Param("search") String search,
            @Param("type") String type,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice);

    // Lấy tất cả types có trong database
    @Query("SELECT DISTINCT p.type FROM Product p WHERE p.type IS NOT NULL")
    List<String> findAllDistinctTypes();
}