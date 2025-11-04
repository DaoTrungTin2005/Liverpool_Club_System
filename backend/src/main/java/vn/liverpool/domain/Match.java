package vn.liverpool.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "matches")
@Getter @Setter
public class Match {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tournament;

    @Column(name = "home_team", nullable = false)
    private String homeTeam;

    @Column(name = "away_team", nullable = false)
    private String awayTeam;

    @Column(name = "home_logo")
    private String homeLogo;

    @Column(name = "away_logo")
    private String awayLogo;

    @Column(name = "match_date", nullable = false)
    private LocalDateTime matchDate;

    @Column(nullable = false)
    private String location;
}
