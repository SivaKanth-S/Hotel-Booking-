package com.hotelbooking.config;

import com.hotelbooking.entity.*;
import com.hotelbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds initial sample data into MySQL on first startup.
 * Runs only when tables are empty to avoid duplicate entries.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private HotelRepository hotelRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private RoomAvailabilityRepository roomAvailabilityRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PromotionRepository promotionRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (hotelRepository.count() > 0) {
            System.out.println("[DataInitializer] MySQL already has data — skipping seed.");
            return;
        }
        System.out.println("[DataInitializer] Seeding MySQL database...");

        // ── Users ─────────────────────────────────────────────
        User admin = new User("Admin User", "admin@hotel.com",
                passwordEncoder.encode("Admin@123"), Role.ADMIN);
        User customer1 = new User("Alice Smith", "alice@example.com",
                passwordEncoder.encode("Alice@123"), Role.CUSTOMER);
        User customer2 = new User("Bob Johnson", "bob@example.com",
                passwordEncoder.encode("Bob@123"), Role.CUSTOMER);
        userRepository.saveAll(List.of(admin, customer1, customer2));

        // ── Hotels ────────────────────────────────────────────
        Hotel h1 = new Hotel(
                "The Grand Palace",
                "A luxurious 5-star hotel in the heart of Chennai with world-class amenities and breathtaking sea views.",
                "12 Marina Beach Road, Chennai",
                "Chennai", "India", 5.0,
                "Swimming Pool,Spa,Gym,Free WiFi,Restaurant,Bar,Concierge,Valet Parking",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
        );
        Hotel h2 = new Hotel(
                "Seaside Comfort Inn",
                "A comfortable 4-star hotel offering modern rooms, an outdoor pool, and easy access to the beach.",
                "45 ECR Coast Road, Chennai",
                "Chennai", "India", 4.0,
                "Swimming Pool,Free WiFi,Restaurant,Room Service,Parking",
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"
        );
        Hotel h3 = new Hotel(
                "Heritage Haveli",
                "A charming heritage property blending traditional Rajasthani architecture with contemporary luxury.",
                "7 Johari Bazaar, Jaipur",
                "Jaipur", "India", 4.5,
                "Rooftop Restaurant,Cultural Shows,Spa,Free WiFi,Ayurvedic Treatments",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
        );
        Hotel h4 = new Hotel(
                "Mumbai Skyline Suites",
                "Premium business suites in the BKC financial district with panoramic city skyline views.",
                "Plot C-54, Bandra Kurla Complex, Mumbai",
                "Mumbai", "India", 4.5,
                "Business Center,Gym,Rooftop Pool,Free WiFi,Restaurant,Airport Shuttle",
                "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"
        );
        Hotel h5 = new Hotel(
                "Backwater Bliss Resort",
                "Serene eco-resort on the Kerala backwaters with private villa chalets and Ayurvedic spa.",
                "NH-66 Vembanad Lake Road, Alleppey",
                "Alleppey", "India", 5.0,
                "Private Pool,Ayurvedic Spa,Boat Rides,Free WiFi,Yoga,Organic Restaurant",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
        );
        hotelRepository.saveAll(List.of(h1, h2, h3, h4, h5));

        // ── Rooms ──────────────────────────────────────────────
        // Hotel 1 rooms
        Room r1 = new Room(h1, "Standard", 5500.0, 2,
                "King Bed,AC,Free WiFi,Mini Bar,TV,Safe", 10,
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800");
        Room r2 = new Room(h1, "Deluxe Sea View", 8500.0, 2,
                "King Bed,Sea View,AC,Free WiFi,Mini Bar,Jacuzzi,TV", 8,
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800");
        Room r3 = new Room(h1, "Presidential Suite", 25000.0, 4,
                "Living Room,2 Bedrooms,Butler Service,Jacuzzi,Sea View,Bar,Kitchen", 2,
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800");

        // Hotel 2 rooms
        Room r4 = new Room(h2, "Standard", 3200.0, 2,
                "Double Bed,AC,Free WiFi,TV,Shower", 15,
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800");
        Room r5 = new Room(h2, "Deluxe", 4800.0, 3,
                "Queen Bed,AC,Free WiFi,Mini Bar,Balcony,TV", 10,
                "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800");

        // Hotel 3 rooms
        Room r6 = new Room(h3, "Heritage Room", 6000.0, 2,
                "Traditional Decor,AC,Free WiFi,Courtyard View,TV", 12,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800");
        Room r7 = new Room(h3, "Royal Suite", 15000.0, 4,
                "Rajasthani Decor,Private Terrace,Butler,AC,Free WiFi,Bathtub", 4,
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800");

        // Hotel 4 rooms
        Room r8 = new Room(h4, "Business Suite", 9500.0, 2,
                "Work Desk,High-Speed WiFi,Skyline View,AC,Mini Bar,TV,Safe", 20,
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800");
        Room r9 = new Room(h4, "Executive Suite", 18000.0, 3,
                "Separate Living Area,Pantry,Skyline View,AC,Free WiFi,Jacuzzi", 6,
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800");

        // Hotel 5 rooms
        Room r10 = new Room(h5, "Lake Villa", 12000.0, 2,
                "Private Pool,Backwater View,Butler,AC,Free WiFi,Outdoor Deck", 8,
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800");
        Room r11 = new Room(h5, "Luxury Chalet", 20000.0, 4,
                "2 Bedrooms,Private Jetty,Pool,Ayurvedic Spa Access,Free WiFi", 4,
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800");

        roomRepository.saveAll(List.of(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11));

        // ── Room Availability (next 90 days) ──────────────────
        LocalDate today = LocalDate.now();
        List<Room> allRooms = List.of(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11);
        for (Room room : allRooms) {
            for (int i = 0; i < 90; i++) {
                LocalDate date = today.plusDays(i);
                RoomAvailability avail = new RoomAvailability(room, date, room.getTotalUnits());
                roomAvailabilityRepository.save(avail);
            }
        }

        // ── Promotions ────────────────────────────────────────
        Promotion p1 = new Promotion("WELCOME10", DiscountType.PERCENTAGE, 10.0,
                today, today.plusMonths(6), true);
        Promotion p2 = new Promotion("SUMMER20", DiscountType.PERCENTAGE, 20.0,
                today, today.plusMonths(3), true);
        Promotion p3 = new Promotion("FLAT500", DiscountType.FLAT, 500.0,
                today, today.plusMonths(2), true);
        promotionRepository.saveAll(List.of(p1, p2, p3));

        System.out.println("[DataInitializer] MySQL seeding complete!");
        System.out.println("  → Hotels  : " + hotelRepository.count());
        System.out.println("  → Rooms   : " + roomRepository.count());
        System.out.println("  → Users   : " + userRepository.count());
        System.out.println("  → Promos  : " + promotionRepository.count());
    }
}
