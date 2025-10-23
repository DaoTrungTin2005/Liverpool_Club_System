package vn.liverpool.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.liverpool.domain.Account;

public interface AccountRepository extends JpaRepository<Account, Long> { 
    Optional<Account> findByEmail(String email); // Để check email đã tồn tại

}
