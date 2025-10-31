package vn.liverpool.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.liverpool.domain.dto.AccountResponseDTO;
import vn.liverpool.domain.dto.CreateUserByAdminDTO;
import vn.liverpool.domain.dto.UpdateUserByAdminDTO;
import vn.liverpool.domain.dto.UserListResponseDTO;
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

    // 2. UPDATE USER (EDIT)
    // ==============================
    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<AccountResponseDTO>> editUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserByAdminDTO dto) {

        AccountResponseDTO updated = adminUserService.updateUser(id, dto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    // 3. DELETE USER
    // ==============================
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    // ==============================
    // 4. LIST USERS + PHÂN TRANG + SEARCH
    // ==============================
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<Page<UserListResponseDTO>>> listUsers(

            // Lấy tham số page từ URL, ví dụ /list?page=2
            // Nếu không truyền gì, mặc định là 0 (trang đầu tiên).
            @RequestParam(defaultValue = "0") int page,

            // Lấy tham số size từ URL, ví dụ /list?size=5
            // Nếu không có, mặc định mỗi trang có 10 user.
            @RequestParam(defaultValue = "10") int size,

            // Tham số search không bắt buộc, dùng để lọc theo tên hoặc email, ví dụ
            // /list?search=tin.
            @RequestParam(required = false) String search) {

        // Truy vấn danh sách user từ database.
        // Áp dụng phân trang (Pageable) và từ khóa tìm kiếm (search).
        Page<UserListResponseDTO> users = adminUserService.getUsers(page, size, search);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }
}