package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.liverpool.domain.Tournament;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
}