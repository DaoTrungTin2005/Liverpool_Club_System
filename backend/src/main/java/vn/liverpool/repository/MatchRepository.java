package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vn.liverpool.domain.Match;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    // Để search trong List Match
    @Query("""
                SELECT m FROM Match m
                WHERE LOWER(m.homeTeam) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(m.awayTeam) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(m.location) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(m.tournament.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    Page<Match> searchAllFields(String keyword, Pageable pageable);
}