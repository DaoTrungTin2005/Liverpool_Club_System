package vn.liverpool.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.hibernate.Hibernate;

@Entity
@Table(name = "player")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_name", nullable = false, length = 100)
    private String playerName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "shirt_number")
    private Integer shirtNumber;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;

    @Column(name = "background_image")
    private String backgroundImage;

    @Column(name = "bio_image")
    private String bioImage;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 100)
    private String location;

    @Column(length = 100)
    private String nationality;

    @Column(name = "joined_club")
    private LocalDate joinedClub;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    // cascade = CascadeType.ALL
    // Nếu thao tác với Player, thì các thao tác đó cũng tự động áp dụng cho
    // stats.

    // 3orphanRemoval = true
    // Nếu xóa 1 phần tử khỏi danh sách stats
    // mà không gán nó cho player nào khác,
    // Hibernate sẽ xóa luôn record đó trong database.

    // mapped : bị động : giữ cái khóa ngoại mà PlayerStats trỏ đến Player
    // mappedBy = "player" :
    // Quan hệ này được ánh xạ bởi thuộc tính player trong entity PlayerStats
    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlayerStats> stats;

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