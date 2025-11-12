// src/main/java/vn/liverpool/service/UserContextService.java
package vn.liverpool.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import vn.liverpool.domain.Account;

@Service
@RequiredArgsConstructor
public class UserContextService {

    public Account getCurrentAccount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        return (Account) auth.getPrincipal(); // Spring Security lưu Account vào Principal
    }
}