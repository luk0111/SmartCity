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
    public String login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        User user = userRepository.findByUsername(username);

        if (user == null) {
            return "User not found!";
        }

        if (user.getPassword().equals(password)) {
            return "Login Success!";
        } else {
            return "Wrong password!";
        }
    }

    @PostMapping("/signup")
    public String signup(@RequestBody Map<String, String> signupData) {
        String username = signupData.get("username");
        String password = signupData.get("password");
        // 1. Get new data
        String email = signupData.get("email");
        String gender = signupData.get("gender");

        User existingUser = userRepository.findByUsername(username);
        if (existingUser != null) {
            return "Username already taken!";
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        // 2. Save new data
        newUser.setEmail(email);
        newUser.setGender(gender);

        userRepository.save(newUser);

        return "Signup Success!";
    }
}