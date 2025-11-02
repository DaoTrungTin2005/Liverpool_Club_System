package vn.liverpool.repository;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.liverpool.domain.Player;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    // ktra số áo tồn tại chưa
    boolean existsByShirtNumber(Integer shirtNumber);

    // Làm cái search cầu thủ
    // Nếu search = null → bỏ điều kiện → trả toàn bộ players
    @Query("""
            SELECT p FROM Player p
            LEFT JOIN FETCH p.position
            LEFT JOIN FETCH p.stats ps
            LEFT JOIN FETCH ps.tournament
            WHERE (:search IS NULL
                OR LOWER(p.playerName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR CAST(p.shirtNumber AS string) LIKE CONCAT('%', :search, '%')
                OR LOWER(p.nationality) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.position.name) LIKE LOWER(CONCAT('%', :search, '%'))
            )
            """)
    Page<Player> findAllWithSearch(@Param("search") String search, Pageable pageable);
}