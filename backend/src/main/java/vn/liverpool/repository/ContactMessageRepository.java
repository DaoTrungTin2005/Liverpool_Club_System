package vn.liverpool.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.liverpool.domain.ContactMessage;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    @Query("""
        SELECT c FROM ContactMessage c
        WHERE :keyword IS NULL OR :keyword = '' OR
              LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
              LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
              LOWER(c.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
              LOWER(c.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
        """)
    Page<ContactMessage> searchMessages(
            @Param("keyword") String keyword,
            Pageable pageable);
}