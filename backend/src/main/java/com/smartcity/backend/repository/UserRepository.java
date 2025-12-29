package com.smartcity.backend.repository;
// The folder where we keep database access files.

import com.smartcity.backend.model.User;
// Imports the User shape we just created so this file understands what a "User" is.

import org.springframework.data.jpa.repository.JpaRepository;
// Imports the Spring tool that contains all the standard save/delete/find methods.

public interface UserRepository extends JpaRepository<User, Long> {
// Extends JpaRepository.
// "User" tells it which table to look at.
// "Long" tells it that the ID column is a Long number type.

    User findByUsername(String username);
    // This is "Magic". You don't write the code. Spring reads the name "findByUsername"
    // and automatically writes the SQL: "SELECT * FROM users WHERE username = ?"
    User findByUsernameOrEmail(String username, String email);
    User findByVerificationCode(String code);
}