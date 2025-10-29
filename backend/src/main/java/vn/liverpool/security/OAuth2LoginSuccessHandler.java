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

    Account account = accountRepository.findByEmail(email)
            .orElseGet(() -> createGoogleUser(email, name, googleId));

    String token = jwtProvider.generateToken(account);

    // TRẢ JSON CHO FE
    if (response.isCommitted()) return;

    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    String jsonResponse = """
        {
            "status": "success",
            "message": "Login successful",
            "data": {
                "token": "%s",
                "id": %d,
                "email": "%s",
                "fullname": "%s",
                "role": "%s"
            },
            "timestamp": "%s"
        }
        """.formatted(
            token,
            account.getId(),
            account.getEmail(),
            account.getFullname(),
            account.getRole().getName(),
            java.time.Instant.now()
        );

    response.getWriter().write(jsonResponse);
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