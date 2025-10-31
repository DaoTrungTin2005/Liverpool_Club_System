package vn.liverpool.service;

import java.util.Optional;



import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.liverpool.domain.Account;
import vn.liverpool.domain.Role;
import vn.liverpool.domain.dto.RegisterDTO;
import vn.liverpool.repository.AccountRepository;
import vn.liverpool.repository.RoleRepository;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(AccountRepository accountRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Nhận RegisterDTO (ban đầu dữ liệu gửi từ fe đã map thành RegisterDTO ròi), rồi tạo Account Entity lưu db
    public Account createAccount(RegisterDTO registerDTO) {


        Account account = new Account();
        account.setFullname(registerDTO.getFullname());
        account.setEmail(registerDTO.getEmail());
        account.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        Optional<Role> userRole = roleRepository.findByName("USER");
        if (userRole.isEmpty()) {
            throw new RuntimeException("Role USER not found");
        }
        account.setRole(userRole.get());

    
        account.setUid(generateUID());
        account.setStatus("Offline");
        return accountRepository.save(account);
    }


    private String generateUID() {
        long count = accountRepository.count();
        return String.format("%04dA", count + 1);
    }
}
