package vn.liverpool.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @Operation(summary = "Create new account")
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "200",
        description = "Account created successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(example = "{\"status\":\"success\",\"message\":\"Account created successfully\",\"data\":{\"id\":1,\"fullname\":\"John Doe\",\"email\":\"john@example.com\"}}")
        )
    ),
    @ApiResponse(
        responseCode = "400",
        description = "Validation failed",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(example = "{\"status\":\"error\",\"message\":\"Validation failed\",\"errors\":{\"fullname\":\"Full name is required\",\"email\":\"Email is required\"}}")
        )
    )
})
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
