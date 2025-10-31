package vn.liverpool.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.liverpool.domain.Account;
import vn.liverpool.domain.Role;
import vn.liverpool.domain.dto.AccountResponseDTO;
import vn.liverpool.domain.dto.CreateUserByAdminDTO;
import vn.liverpool.domain.dto.UpdateUserByAdminDTO;
import vn.liverpool.repository.AccountRepository;
import vn.liverpool.repository.RoleRepository;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountResponseDTO createUser(CreateUserByAdminDTO dto) {
        // 1. Kiểm tra email trùng
        if (accountRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }

        // 2. BẮT BUỘC NHẬP PASSWORD
        String rawPassword = dto.getPassword();
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (rawPassword.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        // 3. Tìm role
        Role role = roleRepository.findByName(dto.getRole())
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + dto.getRole()));

        // 4. Mã hóa password
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 5. Tạo account
        Account account = new Account();
        account.setFullname(dto.getFullName());
        account.setEmail(dto.getEmail());
        account.setPassword(encodedPassword);
        account.setRole(role);

        Account saved = accountRepository.save(account);

        // 6. Trả về DTO
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

}
