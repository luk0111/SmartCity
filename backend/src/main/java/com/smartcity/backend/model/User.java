package com.smartcity.backend.model;
// Defines which folder (package) this file belongs to, keeping your project organized.

import jakarta.persistence.*;
// Imports the JPA tools (Java Persistence API) needed to talk to databases.

import lombok.Data;
// Imports 'Lombok', a tool that writes code for us (like Getters and Setters) automatically.

@Entity
// Tells Spring: "This class represents a real table in the database."

@Table(name = "users")
// Tells Spring: "The table in the database is specifically named 'users'."

@Data
// Tells Lombok: "Please automatically generate getUsername(), setUsername(), toString(), etc. for me."

public class User {
// Starts the class definition.

    @Id
    // Tells Spring: "This field is the Primary Key (the unique ID for every row)."

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Tells Spring: "Don't ask me for an ID. Let the Database auto-increment it (1, 2, 3...) automatically."
    private Long id;

    private String username;
    // A standard text field to store the user's name.

    private String password;
    // A standard text field to store the password.
}