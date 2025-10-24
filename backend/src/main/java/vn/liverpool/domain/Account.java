package vn.liverpool.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "created_at", updatable = false) // ko cho sửa
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt; // lưu thời điểm bản ghi chỉnh sửa gần nhất

    // tự chạy khi tạo mới
    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    // tự chạy khi cập nhật
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now(); // khi update, chỉ updatedAt được cập nhật = thời gian hiện tại.
    }
}