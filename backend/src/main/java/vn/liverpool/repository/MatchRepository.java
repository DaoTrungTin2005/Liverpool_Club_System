package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.liverpool.domain.Match;



@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {}
