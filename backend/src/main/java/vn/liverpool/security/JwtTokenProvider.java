package vn.liverpool.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import vn.liverpool.domain.Account;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@ConfigurationProperties(prefix = "liverpool.jwt") // lấy từ application.yml
@Getter
@Setter

// Tạo token, giải mã token, validate token
public class JwtTokenProvider {

    private String base64Secret; // khóa bí mật đã mã hóa base64
    private long tokenValidityInSeconds; // tg sống

    //Hàm tạo khóa bí mật từ chuỗi base64 giải mã thành mảng byte
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(base64Secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // tạo token khi đăng nhập thành công
    public String generateToken(Account account) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + tokenValidityInSeconds * 1000);

        return Jwts.builder()
                .subject(account.getEmail()) // gán email làm subject (định danh user chính)
                .claim("id", account.getId()) // thêm claim phụ (thông tin tuỳ ý)
                .claim("fullname", account.getFullname())
                .claim("role", account.getRole().getName())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey()) // ký token bằng khóa bí mật
                .compact(); // xuất ra chuỗi JWT hoàn chỉnh
    }

    // Giải mã token để lấy email từ token (sau bên cái JwtAuthenticationFilter sẽ dùng hàm này để từ email lấy user từ DB)
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey()) // dùng khóa bí mật để kiểm tra token có hợp lệ không
                .build()
                .parseSignedClaims(token) // giải mã phần payload
                .getPayload()
                .getSubject(); // ấy giá trị email đã lưu trong subject
    }


    // Kiểm tra token có hợp lệ hăm
    // Đúng chữ ký
    // Chưa hết hạn
    // -> Trả true
    // Sau đó bên JwtAuthenticationFilter sẽ dùng hàm này để kiểm tra token gửi lên có hợp lệ ko
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
