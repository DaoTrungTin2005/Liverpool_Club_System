// src/main/java/vn/liverpool/repository/AccountRepository.java
package vn.liverpool.repository;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import vn.liverpool.domain.Account;
import java.util.Optional;

public interface AccountRepository
        extends JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {

    // được tặng thêm khả năng viết truy vấn linh hoạt (Specification) — tức là có
    // thể lọc dữ liệu theo điều kiện động (search, filter, sort...) mà không cần
    // viết SQL thủ công.
    // findAll(Specification<Account> spec, Pageable pageable)

    // findAll(pageable) chỉ phân trang, không lọc được
    // findAll(spec, pageable) thì khác
    // spec mô tả điều kiện WHERE
    // pageable mô tả phân trang + sắp xếp

    boolean existsByEmail(String email);

    Optional<Account> findByEmail(String email);
}