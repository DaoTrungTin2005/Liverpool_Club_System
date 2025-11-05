package vn.liverpool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.liverpool.domain.TicketSetting;

@Repository
public interface TicketSettingRepository extends JpaRepository<TicketSetting, Long> {}