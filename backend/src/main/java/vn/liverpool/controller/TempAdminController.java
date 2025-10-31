// src/main/java/vn/liverpool/controller/TempAdminController.java
package vn.liverpool.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.liverpool.domain.Account;
import vn.liverpool.domain.Role;
import vn.liverpool.repository.AccountRepository;
import vn.liverpool.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

// Tạo controller tạm để tạo tài khoản admin vào db trước (nhớ tắt security)
@RestController
@RequestMapping("/temp")
@RequiredArgsConstructor
public class TempAdminController {

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/create-admin")
    public String createAdmin() {
        if (accountRepository.existsByEmail("admin@liverpool.com")) {
            return "Admin đã tồn tại! Email: admin@liverpool.com";
        }

        // Set mặc định role là admin luôn
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("ADMIN");
                    return roleRepository.save(newRole);
                });

        Account admin = new Account();
        admin.setFullname("Super Admin");
        admin.setEmail("admin@liverpool.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(adminRole);

        accountRepository.save(admin);

        return """
                TẠO ADMIN THÀNH CÔNG!
                Email: admin@liverpool.com
                Mật khẩu: admin123
                Role: ADMIN
                """;
    }
}