package vn.liverpool.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.liverpool.repository.AccountRepository;

@Service
@RequiredArgsConstructor

// Cung cấp cách Spring Security tìm user theo email
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {
        return accountRepository.findByEmail(email) // tìm thấy thì trả về account 
                .orElseThrow(() -> new UsernameNotFoundException("Email not found: " + email));
    }
}
