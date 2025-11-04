
package vn.liverpool.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "stadium_sections")
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class StadiumSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 10)
    private String name;

    @Column(nullable = false)
    private String stand;

    @Column(name = "tier_name", nullable = false)
    private String tierName;

    @Column(name = "image", nullable = false)
    private String view;

}