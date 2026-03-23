package com.nhom.backend.controller;

import com.nhom.backend.dto.LoginRequest;
import com.nhom.backend.dto.LoginResponse;
import com.nhom.backend.entity.User;
import com.nhom.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsernameAndPassword(request.getUsername(), request.getPassword())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Sai tài khoản hoặc mật khẩu");
        }

        return ResponseEntity.ok(new LoginResponse(user.getId(), user.getUsername(), user.getRole()));
    }
}