package vn.liverpool.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.liverpool.domain.dto.RegisterDTO;
import vn.liverpool.service.AccountService;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/create_account")
    public ResponseEntity<?> createAccount(@Valid @RequestBody RegisterDTO dto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Validation failed", "errors", errors));
        }

        try {
            accountService.createAccount(dto);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Account created successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}
