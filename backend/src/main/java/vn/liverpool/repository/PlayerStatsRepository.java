package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.liverpool.domain.PlayerStats;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {

    // Để xóa hết thống kê cũ trong database khi cập nhật player
    @Modifying
    @Query("DELETE FROM PlayerStats ps WHERE ps.player.id = :playerId")
    void deleteAllByPlayerId(@Param("playerId") Long playerId);
}