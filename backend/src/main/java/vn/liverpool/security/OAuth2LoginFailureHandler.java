package vn.liverpool.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class OAuth2LoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {
        
        log.error("OAuth2 Login Failed!");
        log.error("Exception type: {}", exception.getClass().getName());
        log.error("Exception message: {}", exception.getMessage());
        
        if (exception instanceof OAuth2AuthenticationException oauth2Ex) {
            log.error("OAuth2 Error Code: {}", oauth2Ex.getError().getErrorCode());
            log.error("OAuth2 Error Description: {}", oauth2Ex.getError().getDescription());
        }
        
        log.error("Full stack trace:", exception);
        
        // Redirect về trang lỗi với thông tin chi tiết
        String errorMessage = exception.getMessage();
        getRedirectStrategy().sendRedirect(request, response, 
            "/login?error&message=" + java.net.URLEncoder.encode(errorMessage, "UTF-8"));
    }
}