package com.nhom.backend.service;

import com.nhom.backend.dto.user.UserCreateRequest;
import com.nhom.backend.dto.user.UserResponse;
import com.nhom.backend.dto.user.UserUpdateRequest;
import com.nhom.backend.entity.EmployeeEntity;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.exception.BadRequestException;
import com.nhom.backend.exception.ResourceNotFoundException;
import com.nhom.backend.repository.EmployeeRepository;
import com.nhom.backend.repository.FileUploadRepository;
import com.nhom.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Đánh dấu class này là Service (xử lý business logic)
public class AdminUserService {
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;        
    private final PasswordEncoder passwordEncoder;
    private final FileUploadRepository fileUploadRepository;

    public AdminUserService(UserRepository userRepository,
            EmployeeRepository employeeRepository,
            FileUploadRepository fileUploadRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.fileUploadRepository = fileUploadRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Tạo user mới
     */
    public UserResponse create(UserCreateRequest request) {

        // Validate username không được null hoặc rỗng
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new BadRequestException("Username is required");
        }

        // Validate password không được null hoặc rỗng
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }

        // Kiểm tra username đã tồn tại chưa
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        // Tạo đối tượng user mới
        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());

        // Mã hóa password trước khi lưu (quan trọng ATTT)
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Nếu không truyền role thì mặc định là USER
        user.setRole(request.getRole() == null || request.getRole().isBlank()
                ? "USER"
                : request.getRole());

        // Mặc định user đang active
        user.setActive(true);

        // Lưu vào DB và convert sang DTO trả về
        return toResponse(userRepository.save(user));
    }

    /**
     * Lấy danh sách tất cả user
     */
    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse) // convert từng entity sang DTO
                .toList();
    }

    /**
     * Lấy user theo ID
     */
    public UserResponse findById(Long id) {

        // Tìm user theo id, nếu không có thì throw exception
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return toResponse(user);
    }

    /**
     * Cập nhật thông tin user
     */
    public UserResponse update(Long id, UserUpdateRequest request) {

        // Tìm user theo id
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Kiểm tra username mới có bị trùng không
        if (request.getUsername() != null && !request.getUsername().isBlank()
                && !request.getUsername().equals(user.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        // Update username nếu có
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }

        // Update role nếu có
        if (request.getRole() != null && !request.getRole().isBlank()) {
            user.setRole(request.getRole());
        }

        // Update trạng thái active nếu có
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        // Lưu lại DB
        return toResponse(userRepository.save(user));
    }

    /**
     * Xóa user
     */
    @Transactional
    public void delete(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EmployeeEntity employee = employeeRepository.findByUserId(user.getId()).orElse(null);
        if (employee != null) {
            fileUploadRepository.deleteByEmployeeId(employee.getId());
            employeeRepository.delete(employee);
        }

        userRepository.delete(user);
    }

    /**
     * Reset mật khẩu user
     */
    public void resetPassword(Long id, String newPassword) {

        // Tìm user theo id
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validate password mới
        if (newPassword == null || newPassword.isBlank()) {
            throw new BadRequestException("New password is required");
        }

        // Mã hóa password mới
        user.setPassword(passwordEncoder.encode(newPassword));

        // Lưu lại DB
        userRepository.save(user);
    }

    /**
     * Convert Entity → DTO (trả ra API)
     */
    private UserResponse toResponse(UserEntity user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getActive());
    }
}