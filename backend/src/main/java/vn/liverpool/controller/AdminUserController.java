package vn.liverpool.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.liverpool.domain.dto.AccountResponseDTO;
import vn.liverpool.domain.dto.CreateUserByAdminDTO;
import vn.liverpool.service.AdminUserService;
import vn.liverpool.util.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Chỉ ADMIN mới vào được
public class AdminUserController {

    private final AdminUserService adminUserService;


    @PostMapping("/add")
    public ResponseEntity<ApiResponse<AccountResponseDTO>> addUser(
            @Valid @RequestBody CreateUserByAdminDTO dto) {

        AccountResponseDTO response = adminUserService.createUser(dto);
        return ResponseEntity.status(201)
                .body(ApiResponse.success("User added successfully", response));
    }
}