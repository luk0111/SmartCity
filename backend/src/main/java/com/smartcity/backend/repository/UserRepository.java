package com.smartcity.backend.repository;
// The folder where we keep database access files.

import com.smartcity.backend.model.User;
// Imports the User shape we just created so this file understands what a "User" is.

import org.springframework.data.jpa.repository.JpaRepository;
// Imports the Spring tool that contains all the standard save/delete/find methods.

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByUsernameOrEmail(String username, String email);
    User findByVerificationCode(String code);

    User findByEmail(String email);
    User findByResetToken(String resetToken);

}