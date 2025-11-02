package vn.liverpool.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.liverpool.domain.Player;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    boolean existsByShirtNumber(Integer shirtNumber);

    
    // @EntityGraph(attributePaths = {"stats", "stats.tournament"})
    // Optional<Player> findById(Long id);
}