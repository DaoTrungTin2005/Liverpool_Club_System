package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.liverpool.domain.HomepageConfig;

public interface HomepageConfigRepository extends JpaRepository<HomepageConfig, Long> {
}
