package vn.liverpool.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.liverpool.domain.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name); // Để gán role cho account
}
