package com.smartcity.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.application.name:SmartCity}")
    private String appName;

    @Async
    public void sendVerificationEmail(String toEmail, String code) {
        System.out.println("\n📧 === ATTEMPTING TO SEND VERIFICATION EMAIL ===");
        System.out.println("To: " + toEmail);
        System.out.println("Code: " + code);
        System.out.println("From: " + fromEmail);

        if (mailSender == null) {
            System.err.println("❌ ERROR: JavaMailSender is null! Check your configuration.");
            return;
        }

        try {
            // Option 1: Simple mail (more reliable for testing)
            sendSimpleEmail(toEmail, code);

            // Option 2: HTML mail (uncomment if you want HTML)
            // sendHtmlEmail(toEmail, code);

        } catch (Exception e) {
            System.err.println("❌ Email sending failed!");
            System.err.println("Error: " + e.getMessage());

            printDebugInfo();
        }
    }

    private void sendSimpleEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Verify Your SmartCity Account");
        message.setText(
                "Welcome to SmartCity!\n\n" +
                        "Please verify your account by clicking this link:\n" +
                        "http://localhost:5173/verify?code=" + code + "\n\n" +
                        "Or enter this verification code: " + code + "\n\n" +
                        "This link will expire in 24 hours.\n\n" +
                        "If you didn't create an account, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "SmartCity Team"
        );

        mailSender.send(message);
        System.out.println("✅ Simple email sent successfully!");
    }

    private void sendHtmlEmail(String toEmail, String code) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String verificationLink = "http://localhost:5173/verify?code=" + code;
        String htmlContent = """
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Welcome to SmartCity! 🏙️</h2>
                <p>Please verify your email address to activate your account.</p>
                <p>
                    <a href="%s" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                        Verify My Account
                    </a>
                </p>
                <p>Or copy this code: <strong>%s</strong></p>
                <p>Link: %s</p>
                <hr>
                <p><small>If you didn't create an account, please ignore this email.</small></p>
            </body>
            </html>
            """.formatted(verificationLink, code, verificationLink);

        helper.setText(htmlContent, true);
        helper.setTo(toEmail);
        helper.setSubject("Verify Your SmartCity Account");
        helper.setFrom(fromEmail);

        mailSender.send(mimeMessage);
        System.out.println("✅ HTML email sent successfully!");
    }

    private void printDebugInfo() {
        System.out.println("\n=== DEBUG INFO ===");
        System.out.println("1. Check if spring.mail.username is correct in application.properties");
        System.out.println("2. Check if spring.mail.password is a valid Gmail App Password (16 chars, no spaces)");
        System.out.println("3. Make sure 2FA is enabled on the Gmail account");
        System.out.println("4. Try unlocking captcha: https://accounts.google.com/DisplayUnlockCaptcha");
        System.out.println("5. Alternative: Try using a different email provider (Outlook, Yahoo, etc.)");
    }
}