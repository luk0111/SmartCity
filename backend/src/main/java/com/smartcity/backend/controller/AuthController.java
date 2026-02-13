package com.smartcity.backend.controller;

import com.smartcity.backend.model.User;
import com.smartcity.backend.repository.UserRepository;
import com.smartcity.backend.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private com.smartcity.backend.service.EmailService emailService;


    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        User user = userRepository.findByUsernameOrEmail(username, username);

        if (user == null) {
            return Map.of("status", "error", "message", "User not found!");
        }

        if (!user.isEnabled()) {
            return Map.of(
                    "status", "error",
                    "message", "Account not verified!",
                    "suggestion", "Please check your email",
                    "email", user.getEmail()
            );
        }

        // Check Hash
        if (passwordEncoder.matches(password, user.getPassword())) {
            // Generate Token
            String token = jwtUtils.generateToken(user.getUsername());

            return Map.of(
                    "status", "success",
                    "message", "Login successful!",
                    "token", token,
                    "username", user.getUsername()
            );
        } else {
            return Map.of("status", "error", "message", "Wrong password!");
        }
    }

    @PostMapping("/signup")
    public String signup(@RequestBody Map<String, String> signupData) {
        String username = signupData.get("username");
        String password = signupData.get("password");
        String email = signupData.get("email");
        String gender = signupData.get("gender");

        if (userRepository.findByUsernameOrEmail(username, email) != null) {
            return "Username or Email already taken!";
        }

        User newUser = new User();
        newUser.setUsername(username);

        // Hash Password
        newUser.setPassword(passwordEncoder.encode(password));

        newUser.setEmail(email);
        newUser.setGender(gender);

        String randomCode = java.util.UUID.randomUUID().toString();
        newUser.setVerificationCode(randomCode);
        newUser.setEnabled(false);

        userRepository.save(newUser);

        // Send Email (Async)
        emailService.sendVerificationEmail(email, randomCode);

        return "Signup Success! Please check your email to verify.";
    }

    @PostMapping("/verify")
    public String verifyUser(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        User user = userRepository.findByVerificationCode(code);

        if (user == null) {
            return "Invalid Code";
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        userRepository.save(user);

        return "Verified!";
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return Map.of("status", "error", "message", "If that email exists, a reset link has been sent.");
        }

        String token = java.util.UUID.randomUUID().toString();
        user.setResetToken(token);
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(email, token);
            System.out.println("Password reset email sent to: " + email + " with token: " + token);
        } catch (Exception e) {
            System.err.println("Failed to send reset email: " + e.getMessage());
            return Map.of("status", "error", "message", "Failed to send email. Check console.");
        }

        return Map.of("status", "success", "message", "If that email exists, a reset link has been sent.");
    }
    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        User user = userRepository.findByResetToken(token);

        if (user == null) {
            return Map.of("status", "error", "message", "Invalid or expired reset token.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRepository.save(user);

        return Map.of("status", "success", "message", "Password successfully updated! You can now log in.");
    }
}