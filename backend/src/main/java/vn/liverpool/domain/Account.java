package vn.liverpool.domain;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
public class Account implements UserDetails {

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

    // ===== UserDetails methods =====
// UserDetails
    @Override
    // Trrả về danh sách roles) của user
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) return List.of();
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.getName().toUpperCase()));
    }

    @Override public String getUsername() { return email; } //Trả về email (dùng để đăng nhập)
    @Override public String getPassword() { return password; }
    @Override public boolean isAccountNonExpired() { return true; } //Kiểm tra tài khoản hết hạn chưa
    @Override public boolean isAccountNonLocked() { return true; } //Kiểm tra tài khoản bị khóa chưa
    @Override public boolean isCredentialsNonExpired() { return true; } // mk hết hạn chưa
    @Override public boolean isEnabled() { return true; } // tài khoản đnag hoạt đ ko
}