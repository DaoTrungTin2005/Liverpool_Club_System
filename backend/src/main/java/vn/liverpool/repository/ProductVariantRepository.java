package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.liverpool.domain.ProductVariant;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
}