package com.hotelbooking;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelbooking.dto.AuthRequest;
import com.hotelbooking.dto.RegisterRequest;
import com.hotelbooking.entity.Role;
import com.hotelbooking.entity.User;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    private static final String TEST_EMAIL = "customer@example.com";
    private static final String TEST_PASSWORD = "Customer@123";

    private static final String ADMIN_EMAIL = "admin@gmail.com";
    private static final String ADMIN_PASSWORD = "admin123";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Prevents real SMTP connection attempts during testing
    @MockBean
    private EmailService emailService;

    @BeforeEach
    public void setUp() {
        doNothing().when(emailService).sendWelcomeEmail(any(), any());
        doNothing().when(emailService).sendBookingConfirmationEmail(any(), any(), any());
        doNothing().when(emailService).sendBookingCancellationEmail(any(), any(), any());

        if (userRepository.findByEmail(TEST_EMAIL).isEmpty()) {
            User testUser = new User(
                    "Test Customer",
                    TEST_EMAIL,
                    passwordEncoder.encode(TEST_PASSWORD),
                    Role.CUSTOMER
            );
            userRepository.save(testUser);
        }

        userRepository.findByEmail(ADMIN_EMAIL).ifPresentOrElse(
                admin -> {
                    admin.setPasswordHash(passwordEncoder.encode(ADMIN_PASSWORD));
                    admin.setRole(Role.ADMIN);
                    userRepository.save(admin);
                },
                () -> {
                    User adminUser = new User(
                            "Admin",
                            ADMIN_EMAIL,
                            passwordEncoder.encode(ADMIN_PASSWORD),
                            Role.ADMIN
                    );
                    userRepository.save(adminUser);
                }
        );
    }

    @Test
    public void testLoginSuccess() throws Exception {
        AuthRequest request = new AuthRequest(TEST_EMAIL, TEST_PASSWORD);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(TEST_EMAIL))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }

    @Test
    public void testAdminLoginSuccess() throws Exception {
        AuthRequest request = new AuthRequest(ADMIN_EMAIL, ADMIN_PASSWORD);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(ADMIN_EMAIL))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    public void testLoginInvalidCredentials() throws Exception {
        AuthRequest request = new AuthRequest(TEST_EMAIL, "WrongPassword123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    public void testRegisterNewCustomer() throws Exception {
        String uniqueEmail = "newuser_" + System.currentTimeMillis() + "@example.com";
        RegisterRequest request = new RegisterRequest("New Customer", uniqueEmail, "SecretPass@123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value(uniqueEmail))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }
}
