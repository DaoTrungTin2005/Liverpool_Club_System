package vn.liverpool.repository;

import vn.liverpool.domain.Product;

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
}