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

    public Account createAccount(RegisterDTO registerDTO) {
        if (accountRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Account account = new Account();
        account.setFullname(registerDTO.getFullname());
        account.setEmail(registerDTO.getEmail());
        account.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        Optional<Role> userRole = roleRepository.findByName("USER");
        if (userRole.isEmpty()) {
            throw new RuntimeException("Role USER not found");
        }
        account.setRole(userRole.get());
        return accountRepository.save(account);
    }
}
