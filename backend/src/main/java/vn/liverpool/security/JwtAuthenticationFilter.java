// src/main/java/vn/liverpool/security/JwtAuthenticationFilter.java
package vn.liverpool.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import javax.swing.Spring;

@Component
@RequiredArgsConstructor

// Mỗi request gửi kèm JWT, filter này kiểm tra token, lấy user từ DB và đưa vào
// SecurityContext (sau này cần đọc user hiện tại chỉ cần lấy từ
// SecurityContext)
// Nó được chạy trước khi controller
// Ktra xem token gửi lên có hợp lệ ko, nếu hợp lệ thì lấy user từ token gán vào
// SecurityContext -> những lần sau khỏi cần đăng nhập lại, chỉ cần gửi token là
// biết mày là ai
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain) throws ServletException, IOException {

        // lấy token ra
        String token = getToken(req);

        // xác thực token có hợp lệ không (có cái hàm validateToken bên
        // JwtTokenProvider)
        if (token != null && jwtProvider.validateToken(token)) {

            // Nếu hợp lệ -> lấy email từ token(lưu trong phần payload)
            String email = jwtProvider.getEmailFromToken(token);

            // Lấy thông tin user từ DB
            UserDetails user = userDetailsService.loadUserByUsername(email);

            // Gắn user vào SecurityContext
            // auth là một đối tượng “Authentication” đại diện cho user đã đăng nhập.

            // Ở những request sau, không cần đăng nhập lại,
            // chỉ cần gửi token là Spring biết là ai (vì nó đã gắn Authentication vào
            // SecurityContext)

            // Khi cần đọc user hiện tại thì Lấy thông tin user đã xác thực từ
            // SecurityContextHolder
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null,
                    user.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req)); // bỏ vào security context để nhớ 
            SecurityContextHolder.getContext().setAuthentication(auth); // được đi tiếp nếu hợp lệ
        }
        chain.doFilter(req, res);
    }

    // Hàm lấy token ra
    private String getToken(HttpServletRequest req) {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) { // Nếu header bắt đầu bằng "Bearer ",cắt bỏ tiền tố
                                                              // "Bearer " để lấy phần JWT thật.
            return header.substring(7);
        }
        return null;
    }
}