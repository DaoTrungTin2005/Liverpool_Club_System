package vn.liverpool.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "player_stats", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "player_id", "tournament_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    // bảng player_stats sẽ có một cột tên là player_id.
    // Cột đó tham chiếu đến cột id của bảng player.
    @JoinColumn(name = "player_id", nullable = false) // KHÓA NGOẠI NẰM Ở PLAYERSTATS Ở PLAYER_ID
    private Player player;

    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer matches = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer goals = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer assists = 0;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}