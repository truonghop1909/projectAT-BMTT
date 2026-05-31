package com.nhom.backend.controller;

import com.nhom.backend.dto.auth.RegisterRequest;
import com.nhom.backend.dto.user.UserResponse;
import com.nhom.backend.dto.user.UserUpdateRequest;
import com.nhom.backend.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController // Đánh dấu controller REST (trả JSON)
@RequestMapping("/api/admin/users") // Base URL cho tất cả API
public class AdminUserController {

    private final AdminUserService adminUserService;

    // Constructor injection
    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    /**
     * API tạo user mới
     * Method: POST
     * URL: /api/admin/users
     */
    @PostMapping
    public ResponseEntity<UserResponse> create(@RequestBody RegisterRequest request) {

        // Gọi service để tạo user
        return ResponseEntity.ok(adminUserService.create(request));
    }

    /**
     * API lấy danh sách tất cả user
     * Method: GET
     * URL: /api/admin/users
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> findAll() {

        return ResponseEntity.ok(adminUserService.findAll());
    }

    /**
     * API lấy chi tiết user theo ID
     * Method: GET
     * URL: /api/admin/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> findById(@PathVariable Long id) {

        return ResponseEntity.ok(adminUserService.findById(id));
    }

    /**
     * API cập nhật user
     * Method: PUT
     * URL: /api/admin/users/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id,
                                               @RequestBody UserUpdateRequest request) {

        return ResponseEntity.ok(adminUserService.update(id, request));
    }

    /**
     * API reset mật khẩu
     * Method: PUT
     * URL: /api/admin/users/{id}/reset-password
     */
    @PutMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id,
                                           @RequestBody Map<String, String> body) {

        // Lấy password mới từ body
        adminUserService.resetPassword(id, body.get("newPassword"));

        return ResponseEntity.ok(Map.of("message", "Reset password success"));
    }

    /**
     * API xóa user
     * Method: DELETE
     * URL: /api/admin/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        adminUserService.delete(id);

        return ResponseEntity.ok(Map.of("message", "Delete user success"));
    }
}