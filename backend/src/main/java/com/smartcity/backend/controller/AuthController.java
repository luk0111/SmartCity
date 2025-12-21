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
}