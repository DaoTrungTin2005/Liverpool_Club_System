package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.liverpool.domain.StadiumSection;

@Repository
public interface StadiumSectionRepository extends JpaRepository<StadiumSection, Long> {}
