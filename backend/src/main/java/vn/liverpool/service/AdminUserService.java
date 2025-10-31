package vn.liverpool.service;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.liverpool.domain.Account;
import vn.liverpool.domain.Role;
import vn.liverpool.domain.dto.AccountResponseDTO;
import vn.liverpool.domain.dto.CreateUserByAdminDTO;
import vn.liverpool.domain.dto.UpdateUserByAdminDTO;
import vn.liverpool.domain.dto.UserListResponseDTO;
import vn.liverpool.repository.AccountRepository;
import vn.liverpool.repository.RoleRepository;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountResponseDTO createUser(CreateUserByAdminDTO dto) {
        if (accountRepository.existsByEmail(dto.email())) { // ← dto.email()
            throw new IllegalArgumentException("Email already exists: " + dto.email());
        }

        String rawPassword = dto.password(); // ← dto.password()
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (rawPassword.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        Role role = roleRepository.findByName(dto.role()) // ← dto.role()
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + dto.role()));

        Account account = new Account();
        account.setFullname(dto.fullName()); // ← dto.fullName()
        account.setEmail(dto.email());
        account.setPassword(passwordEncoder.encode(rawPassword));
        account.setRole(role);
        account.setUid(generateUID()); // ← THÊM
        account.setStatus("Offline"); // ← THÊM

        Account saved = accountRepository.save(account);

        return new AccountResponseDTO(
                saved.getId(),
                saved.getFullname(),
                saved.getEmail(),
                saved.getCreatedAt(),
                saved.getUpdatedAt());
    }

    // =================== UPDATE ===========================

    public AccountResponseDTO updateUser(Long id, UpdateUserByAdminDTO dto) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        // Kiểm tra email trùng (trừ chính nó)
        if (!account.getEmail().equals(dto.email()) &&
                accountRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email already exists: " + dto.email());
        }

        Role role = roleRepository.findByName(dto.role())
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + dto.role()));

        // CHỈ CẬP NHẬT: fullName, email, role
        account.setFullname(dto.fullName());
        account.setEmail(dto.email());
        account.setRole(role);
        // KHÔNG ĐỘNG VÀO PASSWORD

        Account saved = accountRepository.save(account);

        return new AccountResponseDTO(
                saved.getId(),
                saved.getFullname(),
                saved.getEmail(),
                saved.getCreatedAt(),
                saved.getUpdatedAt());
    }

    // ===============DELETE===================

    public void deleteUser(Long id) {
        // Kiểm tra user có tồn tại kh
        if (!accountRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        accountRepository.deleteById(id);
    }

    // =================== LIST + PHÂN TRANG + SEARCH ===================
    public Page<UserListResponseDTO> getUsers(int page, int size, String search) {

        // Tạo phân trang (sắp xếp theo ngày tạo mới nhất)
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Specification = where (tạo hàm findAll trong repo rồi (có thể lọc))
        Specification<Account> spec = (root, query, cb) -> {
            if (search == null || search.isBlank()) {
                // Nếu search rỗng → cb.conjunction() (nghĩa là không có điều kiện, lấy hết).
                return cb.conjunction();
            }

            // Nếu có search → tạo điều kiện tìm theo:
            // tên (fullname)
            // email
            // mã người dùng (uid)
            String like = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("fullname")), like),
                    cb.like(cb.lower(root.get("email")), like),
                    cb.like(cb.lower(root.get("uid")), like));
        };

        // findAll(spec, pageable) là hàm của JpaSpecificationExecutor.
        // Kết quả trả về một Page<Account> — trong đó có danh sách account + thông tin
        // phân trang.
        Page<Account> accountPage = accountRepository.findAll(spec, pageable);

        //Bỏ vào response trả ra cho FE (ẩn password)
        List<UserListResponseDTO> dtos = accountPage.stream()
                .map(account -> new UserListResponseDTO(
                        account.getId(),
                        account.getUid(),
                        account.getFullname(),
                        account.getEmail(),
                        account.getRole().getName(),
                        account.getStatus(),
                        account.getCreatedAt()))
                .toList();

                // Trả kq
        return new PageImpl<>(dtos, pageable, accountPage.getTotalElements());
    }

    // =================== GENERATE UID ===================
    private String generateUID() {
        long count = accountRepository.count();
        return String.format("%04dA", count + 1);
    }

}
