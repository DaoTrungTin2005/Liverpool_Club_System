package vn.liverpool.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.liverpool.domain.TicketSetting;

public interface TicketSettingRepository extends JpaRepository<TicketSetting, Long> {

@Query("""
        SELECT ts FROM TicketSetting ts
        JOIN ts.section s
        JOIN ts.match m
        WHERE (:sectionName IS NULL OR :sectionName = ''
               OR LOWER(s.name) LIKE LOWER(CONCAT('%', :sectionName, '%')))
          AND (:matchSearch IS NULL OR :matchSearch = ''
               OR LOWER(m.homeTeam) LIKE LOWER(CONCAT('%', :matchSearch, '%'))
               OR LOWER(m.awayTeam) LIKE LOWER(CONCAT('%', :matchSearch, '%')))
        """)
Page<TicketSetting> searchTickets(
        @Param("sectionName") String sectionName,
        @Param("matchSearch") String matchSearch,
        Pageable pageable);
}