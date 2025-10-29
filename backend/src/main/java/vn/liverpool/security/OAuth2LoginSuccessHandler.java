package vn.liverpool.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import vn.liverpool.domain.Account;
import vn.liverpool.domain.Role;
import vn.liverpool.repository.AccountRepository;
import vn.liverpool.repository.RoleRepository;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtProvider;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;

@Override
public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                    Authentication authentication) throws IOException {

    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    Map<String, Object> attributes = oAuth2User.getAttributes();

    String email = (String) attributes.get("email");
    String name = (String) attributes.get("name");
    String googleId = (String) attributes.get("sub");

    log.info("Google OAuth2 Success: email={}, name={}, googleId={}", email, name, googleId);

    Account account = accountRepository.findByEmail(email)
            .orElseGet(() -> {
                log.info("Creating new Google user: {}", email);
                return createGoogleUser(email, name, googleId);
            });

    String token = jwtProvider.generateToken(account);

    // MÃ HÓA fullname để tránh lỗi Unicode
    String encodedFullname = URLEncoder.encode(account.getFullname(), StandardCharsets.UTF_8);

    String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:8080/oauth2-success.html")
            .queryParam("token", token)
            .queryParam("email", account.getEmail())
            .queryParam("fullname", encodedFullname)
            .build().toUriString();

    log.info("Redirecting to: {}", targetUrl);
    getRedirectStrategy().sendRedirect(request, response, targetUrl);
}

    private Account createGoogleUser(String email, String name, String googleId) {
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("❌ Role USER not found! Please run SQL: INSERT INTO roles (name) VALUES ('USER');"));

        Account account = new Account();
        account.setEmail(email);
        account.setFullname(name);
        account.setGoogleId(googleId);
        account.setRole(userRole);
        
        // ✅ Set password ngẫu nhiên cho Google user (vì họ không dùng password login)
        // Hoặc để null nếu đã cho phép nullable=true ở Entity
        account.setPassword(UUID.randomUUID().toString()); // Password random, không ai biết được
        
        return accountRepository.save(account);
    }
}