package com.smartcity.backend.controller;

import com.smartcity.backend.model.User;
import com.smartcity.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        User user = userRepository.findByUsernameOrEmail(username, username);

        if (user == null) {
            return Map.of(
                    "status", "error",
                    "message", "User not found!"
            );
        }

        // Check if account is verified
        if (!user.isEnabled()) {
            return Map.of(
                    "status", "error",
                    "message", "Account not verified!",
                    "suggestion", "Please check your email and click the verification link",
                    "email", user.getEmail()
            );
        }

        if (user.getPassword().equals(password)) {
            return Map.of(
                    "status", "success",
                    "message", "Login successful!",
                    "username", user.getUsername(),
                    "email", user.getEmail()
            );
        } else {
            return Map.of(
                    "status", "error",
                    "message", "Wrong password!"
            );
        }
    }
    @Autowired
    private com.smartcity.backend.service.EmailService emailService;
    @PostMapping("/signup")
    public String signup(@RequestBody Map<String, String> signupData) {
        String username = signupData.get("username");
        String password = signupData.get("password");
        String email = signupData.get("email");
        String gender = signupData.get("gender");

        System.out.println("Signup attempt for: " + username + ", email: " + email); // DEBUG

        User existingUser = userRepository.findByUsernameOrEmail(username, email);
        if (existingUser != null) {
            System.out.println("User already exists: " + username); // DEBUG
            return "Username or Email already taken!";
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setEmail(email);
        newUser.setGender(gender);

        String randomCode = java.util.UUID.randomUUID().toString();
        newUser.setVerificationCode(randomCode);
        newUser.setEnabled(false);

        userRepository.save(newUser);
        System.out.println("User saved with code: " + randomCode); // DEBUG

        // Try-catch to see if email service is failing
        try {
            System.out.println("Attempting to send email to: " + email); // DEBUG
            emailService.sendVerificationEmail(email, randomCode);
            System.out.println("Email service called successfully"); // DEBUG
        } catch (Exception e) {
            System.err.println("Email sending failed: " + e.getMessage());
            e.printStackTrace();
        }

        return "Signup Success! Please check your email to verify.";
    }
    @PostMapping("/verify")
    public String verifyUser(@RequestBody Map<String, String> body) {
        String code = body.get("code");

        // Find user by their special code
        // (Note: You might need to add findByVerificationCode to your Repository!)
        User user = userRepository.findByVerificationCode(code);

        if (user == null) {
            return "Invalid Code";
        }

        user.setEnabled(true); // Turn them ON
        user.setVerificationCode(null); // Clear the code (can't be used twice)
        userRepository.save(user);

        return "Verified!";
    }
}