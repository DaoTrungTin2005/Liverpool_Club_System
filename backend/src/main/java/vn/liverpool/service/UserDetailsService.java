package vn.liverpool.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.liverpool.repository.AccountRepository;

@Service
@RequiredArgsConstructor

// Cung cấp cách Spring Security tìm user theo email (tìm thôi chứ ko kiểm tra
// password, cái ktra là ở entity Account á)
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String email) { // trả về userDetails Đại diện cho “user đã được Spring hiểu” (có password, roles,....)
        return accountRepository.findByEmail(email) // Khi cái entity Account implement UserDetails thì xài dc mấy ph thức trong Spring Security
                .orElseThrow(() -> new UsernameNotFoundException("Email not found: " + email));
    }
}
