package com.smartcity.backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailTestService {

    @Autowired(required = false)  // Add required=false
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @PostConstruct
    public void testEmailConnection() {
        System.out.println("\n🔍 === EMAIL TEST SERVICE STARTING ===");

        if (mailSender == null) {
            System.err.println("❌ CRITICAL ERROR: JavaMailSender bean is NULL!");
            System.err.println("This means Spring could not create the mail sender.");
            System.err.println("Possible reasons:");
            System.err.println("1. Missing dependencies in pom.xml");
            System.err.println("2. Invalid email configuration in application.properties");
            System.err.println("3. Spring Boot auto-configuration failed");
            System.err.println("================================================");
            return;
        }

        if (fromEmail == null || fromEmail.isEmpty()) {
            System.err.println("❌ ERROR: spring.mail.username is not set!");
            return;
        }

        System.out.println("✓ JavaMailSender: Available");
        System.out.println("✓ From Email: " + fromEmail);

        try {
            // Test email to yourself
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo("smartcityinquiries@gmail.com");  // Send to yourself
            message.setSubject("SMTP Connection Test - SmartCity");
            message.setText("Hello! If you receive this, your email configuration is working correctly!");

            System.out.println("📤 Attempting to send test email...");
            mailSender.send(message);
            System.out.println("✅ SUCCESS: Test email sent!");
            System.out.println("📨 Please check your Gmail inbox (and spam folder)!");

        } catch (Exception e) {
            System.err.println("❌ FAILED to send test email!");
            System.err.println("Error type: " + e.getClass().getName());
            System.err.println("Error message: " + e.getMessage());

            // Print full stack trace for debugging
            e.printStackTrace();

            // Specific troubleshooting
            if (e.getMessage().contains("535") || e.getMessage().contains("Authentication")) {
                System.err.println("\n🔑 === AUTHENTICATION ERROR ===");
                System.err.println("Your app password might be incorrect or 2FA is not enabled.");
                System.err.println("Steps to fix:");
                System.err.println("1. Go to: https://myaccount.google.com/apppasswords");
                System.err.println("2. Generate a NEW 16-character App Password");
                System.err.println("3. Copy it WITHOUT spaces");
                System.err.println("4. Update application.properties");
                System.err.println("5. Make sure 2FA is enabled on the Gmail account");
            } else if (e.getMessage().contains("Could not connect")) {
                System.err.println("\n🌐 === CONNECTION ERROR ===");
                System.err.println("Try using port 465 with SSL:");
                System.err.println("spring.mail.port=465");
                System.err.println("spring.mail.properties.mail.smtp.ssl.enable=true");
                System.err.println("spring.mail.properties.mail.smtp.starttls.enable=false");
            }
        }
        System.out.println("=========================================\n");
    }
}