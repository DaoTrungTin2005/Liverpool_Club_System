// src/main/java/vn/liverpool/config/SecurityConfig.java
package vn.liverpool.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import vn.liverpool.security.JwtAuthenticationFilter;
import vn.liverpool.security.OAuth2LoginFailureHandler;
import vn.liverpool.security.OAuth2LoginSuccessHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // ✅ Tắt CSRF vì dùng JWT (stateless)
            .csrf(csrf -> csrf.disable())

            // ✅ Cho phép CORS nếu bạn gọi từ frontend khác port (VD: 3000)
            .cors(cors -> cors.disable()) // hoặc cấu hình riêng WebMvcConfigurer nếu cần

            // ✅ Không tạo session (dùng JWT)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ✅ Cấu hình quyền truy cập
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/login",
                    "/api/accounts/create_account",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/oauth2/**",               // Cho phép endpoint OAuth2
                    "/login/oauth2/**",         // Callback URL của Google
                    "/error" ,
                    "/api/auth/login/google",
                    "/api/auth/login/google/start",
                    "/oauth2-success.html"                   // Cho phép hiển thị trang lỗi
                ).permitAll()
                .anyRequest().authenticated()
            )

            // ✅ Cấu hình OAuth2 Login
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2LoginSuccessHandler)
                .failureHandler(oAuth2LoginFailureHandler)
            )

            // ✅ Thêm JWT Filter (đặt trước UsernamePasswordAuthenticationFilter)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ✅ Mã hoá mật khẩu
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ AuthenticationManager (gọi UserDetailsService và PasswordEncoder)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
