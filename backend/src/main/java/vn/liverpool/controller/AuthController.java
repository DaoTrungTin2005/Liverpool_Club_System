// src/main/java/vn/liverpool/controller/AuthController.java
package vn.liverpool.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vn.liverpool.domain.Account;
import vn.liverpool.domain.dto.LoginRequest;
import vn.liverpool.domain.dto.LoginResponse;
import vn.liverpool.security.JwtTokenProvider;
import vn.liverpool.util.ApiResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        // Xác thực email + password

        // Nó làm 3 việc ngầm:
        // Tạo đối tượng UsernamePasswordAuthenticationToken
        // Object này chứa thông tin mà user vừa nhập (email, password).
        // Spring tự động gọi UserDetailsService.loadUserByUsername(email)
        // để tìm user trong DB.
        // Spring tự so sánh password nhập vào với password trong DB
        // sử dụng PasswordEncoder (thường là BCryptPasswordEncoder). (DaoAuthenticationProvider)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        // Lấy Account từ Principal

        // Vì Account implements UserDetails, nên Spring đặt chính Account vào
        // principal.
        // Lúc này, account chứa đầy đủ:id email fullname role (để gán quyền)

        Account account = (Account) authentication.getPrincipal();

        // Tạo JWT khi đăng nhập thành công (cục zàng nên nhớ là cái
        // JwtAuthenticationFilter nó chạy trc controller nha, nên lần đầu đăng nhập này
        // chưa có token, sau khi đăng nhập thành công thì tạo token gửi về cho fe,
        // những lần sau fe gửi kèm token lên, filter (chạy trc controller) nó kiểm tra
        // token rồi lấy user từ token gán vào SecurityContext luôn ko cần đăng nhập
        // lại)
        String token = jwtProvider.generateToken(account);

        // Trả về response
        LoginResponse response = new LoginResponse(
                token,
                account.getId(),
                account.getEmail(),
                account.getFullname(),
                account.getRole().getName());

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/login/google")
public void loginWithGoogle(HttpServletResponse response) throws IOException {
    response.sendRedirect("/oauth2/authorization/google");
}
}