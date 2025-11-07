package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vn.liverpool.domain.Match;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

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

    // Để lấy danh sách các trận đấu sắp tới

    // SELECT * FROM match
    // WHERE match_date > ?
    // ORDER BY match_date ASC

    // tìm match có matchDate sau thời gian hiện tại , sắp xếp giảm dần (trận gần nhất ở dầu list)
    List<Match> findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime currentDate);
}