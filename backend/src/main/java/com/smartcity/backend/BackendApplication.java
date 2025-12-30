package com.smartcity.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.mail.javamail.JavaMailSender;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class BackendApplication {

    @Autowired(required = false) // required=false to avoid startup failure
    private JavaMailSender mailSender;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @PostConstruct
    public void checkEmailConfig() {
        System.out.println("\n=== EMAIL CONFIGURATION CHECK ===");
        if (mailSender == null) {
            System.err.println("JavaMailSender is NULL! Email configuration failed!");
            System.err.println("Check your application.properties and pom.xml dependencies");
        } else {
            System.out.println("JavaMailSender is configured and ready!");
            System.out.println("Class: " + mailSender.getClass().getName());
        }
        System.out.println("===================================\n");
    }
}