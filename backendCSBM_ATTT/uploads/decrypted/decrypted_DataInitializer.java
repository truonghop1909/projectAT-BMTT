package com.nhom.backend.config;

import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Nếu chưa có tài khoản ADMIN nào thì tạo mới
        if (!userRepository.existsByRole("ADMIN")) {
            UserEntity admin = new UserEntity();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole("ADMIN");
            admin.setActive(true);

            userRepository.save(admin);

            System.out.println(">>> Seeded default admin account: username=admin, password=123456");
        }
    }
}