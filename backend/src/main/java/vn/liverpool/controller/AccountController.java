package vn.liverpool.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.liverpool.util.ApiResponse;
import jakarta.validation.Valid;
import vn.liverpool.domain.dto.AccountResponseDTO;
import vn.liverpool.domain.dto.RegisterDTO;
import vn.liverpool.service.AccountService;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    //RequestBody để nhận dữ liệu từ fe map thành RegisterDTO
    @PostMapping("/create_account")
    public ResponseEntity<ApiResponse<AccountResponseDTO>> createAccount(
            @Valid @RequestBody RegisterDTO dto) {

    // Ròi tạo entity account từ RegisterDTO á hehehehehe
        var account = accountService.createAccount(dto);

        // Gói phản hồi lại gửi về fe
        var responseDTO = new AccountResponseDTO(
                account.getId(),
                account.getFullname(),
                account.getEmail(),
                account.getCreatedAt(),
                account.getUpdatedAt());

        return ResponseEntity.status(HttpStatus.CREATED) // 201 á
                .body(ApiResponse.success("Account created successfully", responseDTO)); // ApiResponse viết trong util là format response , responseDTO là data đó hehe
    }
}
