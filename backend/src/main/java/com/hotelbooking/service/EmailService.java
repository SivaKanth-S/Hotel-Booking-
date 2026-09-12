package com.hotelbooking.service;

import com.hotelbooking.dto.BookingResponse;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.mail.from-name}")
    private String fromName;

    // -----------------------------------------------------------------------
    // Welcome email sent after successful registration
    // -----------------------------------------------------------------------
    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        String subject = "Welcome to Hotel Booking — Your account is ready!";
        String body = buildWelcomeHtml(userName, toEmail);
        sendHtmlEmail(toEmail, subject, body);
    }

    // -----------------------------------------------------------------------
    // Booking confirmation email
    // -----------------------------------------------------------------------
    @Async
    public void sendBookingConfirmationEmail(String toEmail, String userName, BookingResponse booking) {
        String subject = "Booking Confirmed — " + booking.getReservationNumber();
        String body = buildBookingConfirmationHtml(userName, booking);
        sendHtmlEmail(toEmail, subject, body);
    }

    // -----------------------------------------------------------------------
    // Booking cancellation email
    // -----------------------------------------------------------------------
    @Async
    public void sendBookingCancellationEmail(String toEmail, String userName, BookingResponse booking) {
        String subject = "Booking Cancelled — " + booking.getReservationNumber();
        String body = buildBookingCancellationHtml(userName, booking);
        sendHtmlEmail(toEmail, subject, body);
    }

    // -----------------------------------------------------------------------
    // Core send helper — catches all mail exceptions so they never bubble up
    // -----------------------------------------------------------------------
    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent to {} — subject: {}", to, subject);
        } catch (MailException | MessagingException | java.io.UnsupportedEncodingException ex) {
            // Log but never propagate — email failure must not break the API response
            log.error("Failed to send email to {} — {}", to, ex.getMessage(), ex);
        }
    }

    // -----------------------------------------------------------------------
    // HTML templates
    // -----------------------------------------------------------------------

    private String buildWelcomeHtml(String userName, String email) {
        return "<!DOCTYPE html>" +
               "<html><head><meta charset='UTF-8'>" +
               "<style>" +
               "  body{font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:0}" +
               "  .wrapper{max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)}" +
               "  .header{background:#1a3c5e;padding:30px 40px;text-align:center}" +
               "  .header h1{color:#ffffff;margin:0;font-size:24px;letter-spacing:1px}" +
               "  .body{padding:32px 40px;color:#333333;line-height:1.6}" +
               "  .body h2{color:#1a3c5e;margin-top:0}" +
               "  .info-box{background:#eef2f7;border-left:4px solid #1a3c5e;padding:14px 18px;border-radius:4px;margin:20px 0}" +
               "  .btn{display:inline-block;margin-top:24px;padding:12px 28px;background:#1a3c5e;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold}" +
               "  .footer{background:#f4f6f9;padding:18px 40px;text-align:center;font-size:12px;color:#888888}" +
               "</style></head><body>" +
               "<div class='wrapper'>" +
               "  <div class='header'><h1>🏨 Hotel Booking</h1></div>" +
               "  <div class='body'>" +
               "    <h2>Welcome, " + escapeHtml(userName) + "!</h2>" +
               "    <p>Your account has been successfully created. You can now search hotels, make reservations, and manage your bookings all in one place.</p>" +
               "    <div class='info-box'>" +
               "      <strong>Account Details</strong><br>" +
               "      Name: " + escapeHtml(userName) + "<br>" +
               "      Email: " + escapeHtml(email) + "<br>" +
               "      Role: Customer" +
               "    </div>" +
               "    <p>If you did not create this account, please ignore this email.</p>" +
               "    <p>Happy travels!<br><strong>The Hotel Booking Team</strong></p>" +
               "  </div>" +
               "  <div class='footer'>© 2026 Hotel Booking. All rights reserved.</div>" +
               "</div></body></html>";
    }

    private String buildBookingConfirmationHtml(String userName, BookingResponse booking) {
        String checkIn  = booking.getCheckInDate()  != null ? booking.getCheckInDate().format(DATE_FMT)  : "-";
        String checkOut = booking.getCheckOutDate() != null ? booking.getCheckOutDate().format(DATE_FMT) : "-";

        return "<!DOCTYPE html>" +
               "<html><head><meta charset='UTF-8'>" +
               "<style>" +
               "  body{font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:0}" +
               "  .wrapper{max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)}" +
               "  .header{background:#1a6e3c;padding:30px 40px;text-align:center}" +
               "  .header h1{color:#ffffff;margin:0;font-size:24px;letter-spacing:1px}" +
               "  .body{padding:32px 40px;color:#333333;line-height:1.6}" +
               "  .body h2{color:#1a6e3c;margin-top:0}" +
               "  table{width:100%;border-collapse:collapse;margin:20px 0}" +
               "  td{padding:10px 14px;border-bottom:1px solid #eeeeee;font-size:14px}" +
               "  td:first-child{font-weight:bold;color:#555555;width:45%}" +
               "  .badge{display:inline-block;padding:4px 12px;background:#d4edda;color:#1a6e3c;border-radius:12px;font-weight:bold;font-size:13px}" +
               "  .total-row td{background:#eef7f0;font-size:15px;font-weight:bold}" +
               "  .footer{background:#f4f6f9;padding:18px 40px;text-align:center;font-size:12px;color:#888888}" +
               "</style></head><body>" +
               "<div class='wrapper'>" +
               "  <div class='header'><h1>✅ Booking Confirmed</h1></div>" +
               "  <div class='body'>" +
               "    <h2>Hi " + escapeHtml(userName) + ", your booking is confirmed!</h2>" +
               "    <p>Here is a summary of your reservation:</p>" +
               "    <table>" +
               "      <tr><td>Reservation No.</td><td>" + escapeHtml(booking.getReservationNumber()) + "</td></tr>" +
               "      <tr><td>Hotel</td><td>" + escapeHtml(booking.getHotelName()) + ", " + escapeHtml(booking.getHotelCity()) + "</td></tr>" +
               "      <tr><td>Room Category</td><td>" + escapeHtml(booking.getRoomCategory()) + "</td></tr>" +
               "      <tr><td>Check-in</td><td>" + checkIn + "</td></tr>" +
               "      <tr><td>Check-out</td><td>" + checkOut + "</td></tr>" +
               "      <tr><td>Nights</td><td>" + booking.getTotalNights() + "</td></tr>" +
               "      <tr><td>Guests</td><td>" + booking.getNumGuests() + "</td></tr>" +
               "      <tr><td>Price / Night</td><td>₹" + String.format("%.2f", booking.getPricePerNight()) + "</td></tr>" +
               (booking.getDiscountAmount() != null && booking.getDiscountAmount() > 0
                   ? "<tr><td>Discount</td><td>- ₹" + String.format("%.2f", booking.getDiscountAmount()) + "</td></tr>"
                   : "") +
               "      <tr class='total-row'><td>Total Price</td><td>₹" + String.format("%.2f", booking.getTotalPrice()) + "</td></tr>" +
               "      <tr><td>Status</td><td><span class='badge'>CONFIRMED</span></td></tr>" +
               "    </table>" +
               "    <p>Please present this confirmation at check-in. We hope you enjoy your stay!</p>" +
               "    <p>Warm regards,<br><strong>The Hotel Booking Team</strong></p>" +
               "  </div>" +
               "  <div class='footer'>© 2026 Hotel Booking. All rights reserved.</div>" +
               "</div></body></html>";
    }

    private String buildBookingCancellationHtml(String userName, BookingResponse booking) {
        String checkIn  = booking.getCheckInDate()  != null ? booking.getCheckInDate().format(DATE_FMT)  : "-";
        String checkOut = booking.getCheckOutDate() != null ? booking.getCheckOutDate().format(DATE_FMT) : "-";

        return "<!DOCTYPE html>" +
               "<html><head><meta charset='UTF-8'>" +
               "<style>" +
               "  body{font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:0}" +
               "  .wrapper{max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)}" +
               "  .header{background:#9e2a2b;padding:30px 40px;text-align:center}" +
               "  .header h1{color:#ffffff;margin:0;font-size:24px;letter-spacing:1px}" +
               "  .body{padding:32px 40px;color:#333333;line-height:1.6}" +
               "  .body h2{color:#9e2a2b;margin-top:0}" +
               "  table{width:100%;border-collapse:collapse;margin:20px 0}" +
               "  td{padding:10px 14px;border-bottom:1px solid #eeeeee;font-size:14px}" +
               "  td:first-child{font-weight:bold;color:#555555;width:45%}" +
               "  .badge{display:inline-block;padding:4px 12px;background:#f8d7da;color:#9e2a2b;border-radius:12px;font-weight:bold;font-size:13px}" +
               "  .footer{background:#f4f6f9;padding:18px 40px;text-align:center;font-size:12px;color:#888888}" +
               "</style></head><body>" +
               "<div class='wrapper'>" +
               "  <div class='header'><h1>❌ Booking Cancelled</h1></div>" +
               "  <div class='body'>" +
               "    <h2>Hi " + escapeHtml(userName) + ", your booking has been cancelled.</h2>" +
               "    <p>The following reservation has been successfully cancelled:</p>" +
               "    <table>" +
               "      <tr><td>Reservation No.</td><td>" + escapeHtml(booking.getReservationNumber()) + "</td></tr>" +
               "      <tr><td>Hotel</td><td>" + escapeHtml(booking.getHotelName()) + ", " + escapeHtml(booking.getHotelCity()) + "</td></tr>" +
               "      <tr><td>Room Category</td><td>" + escapeHtml(booking.getRoomCategory()) + "</td></tr>" +
               "      <tr><td>Check-in</td><td>" + checkIn + "</td></tr>" +
               "      <tr><td>Check-out</td><td>" + checkOut + "</td></tr>" +
               "      <tr><td>Total Price</td><td>₹" + String.format("%.2f", booking.getTotalPrice()) + "</td></tr>" +
               "      <tr><td>Status</td><td><span class='badge'>CANCELLED</span></td></tr>" +
               "    </table>" +
               "    <p>If you believe this was a mistake, please contact our support team.</p>" +
               "    <p>We hope to welcome you again soon!<br><strong>The Hotel Booking Team</strong></p>" +
               "  </div>" +
               "  <div class='footer'>© 2026 Hotel Booking. All rights reserved.</div>" +
               "</div></body></html>";
    }

    // Basic HTML escaping to prevent injection inside email templates
    private String escapeHtml(String input) {
        if (input == null) return "";
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}
