package com.smartcity.backend.controller;
// The folder for API endpoints (Controllers).

import com.smartcity.backend.model.User;
// Imports the User model.

import com.smartcity.backend.repository.UserRepository;
// Imports the tool to talk to the database.

import org.springframework.beans.factory.annotation.Autowired;
// Imports the tool that lets Spring "inject" the repository into this class automatically.

import org.springframework.web.bind.annotation.*;
// Imports tools for handling Web requests (POST, GET, etc.).

import java.util.Map;
// Imports a standard Java map to hold Key-Value pairs (like username="admin").

@RestController
// Tells Spring: "This class is ready to receive web requests and send back data (JSON/Text)."

@RequestMapping("/api/auth")
// Tells Spring: "Any URL starting with 'localhost:8080/api/auth' should come to this file."
public class AuthController {

    @Autowired
    // Tells Spring: "Please find the 'UserRepository' we created earlier and plug it in here so I can use it."
    private UserRepository userRepository;

    @PostMapping("/login")
    // Tells Spring: "If someone sends a POST request specifically to '/login', run the method below."
    public String login(@RequestBody Map<String, String> loginData) {
        // @RequestBody: Takes the JSON coming from React ({username: "x", password: "y"}) and turns it into a Java Map.

        String username = loginData.get("username");
        // Extracts the "username" value from the map.

        String password = loginData.get("password");
        // Extracts the "password" value from the map.

        User user = userRepository.findByUsername(username);
        // Asks the database: "Find me the user row where the name matches 'username'."

        if (user == null) {
            // If the database returns nothing (null), the user doesn't exist.
            return "User not found!";
            // Sends this text back to the React app.
        }

        if (user.getPassword().equals(password)) {
            // Checks if the password in the database matches the password sent from React.
            return "Login Success!";
            // Sends success message back.
        } else {
            return "Wrong password!";
            // Sends failure message back.
        }
    }
}