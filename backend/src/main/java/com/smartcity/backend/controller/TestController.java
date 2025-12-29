package com.smartcity.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @GetMapping("/email")
    public String testEmail() {
        if (mailSender == null) {
            return "❌ JavaMailSender is NULL! Configuration failed.";
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo("smartcityinquiries@gmail.com");
            message.setSubject("Manual Test Email");
            message.setText("This is a manual test from the /api/test/email endpoint");

            mailSender.send(message);
            return "✅ Test email sent to " + fromEmail + ". Check your inbox!";
        } catch (Exception e) {
            return "❌ Failed: " + e.getMessage();
        }
    }

    @GetMapping("/config")
    public String checkConfig() {
        return String.format(
                "Config check:<br>" +
                        "JavaMailSender: %s<br>" +
                        "From Email: %s<br>" +
                        "Host: smtp.gmail.com<br>" +
                        "Port: 587",
                mailSender != null ? "✅ Available" : "❌ NULL",
                fromEmail
        );
    }
}