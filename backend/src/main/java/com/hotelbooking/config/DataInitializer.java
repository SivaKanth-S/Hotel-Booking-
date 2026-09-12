package com.hotelbooking.config;

import com.hotelbooking.entity.*;
import com.hotelbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        // 1. Seed Users
        User admin = new User(
                "GrandStay Administrator",
                "admin@hotelbooking.com",
                passwordEncoder.encode("Admin@123"),
                Role.ADMIN
        );
        userRepository.save(admin);

        User customer = new User(
                "Demo Traveler",
                "customer@example.com",
                passwordEncoder.encode("Customer@123"),
                Role.CUSTOMER
        );
        User savedCustomer = userRepository.save(customer);

        // 2. Seed Promotions
        Promotion promo1 = new Promotion("WELCOME10", DiscountType.PERCENTAGE, 10.0, LocalDate.now().minusMonths(1), LocalDate.now().plusYears(1), true);
        Promotion promo2 = new Promotion("SUMMER25", DiscountType.PERCENTAGE, 25.0, LocalDate.now().minusMonths(1), LocalDate.now().plusYears(1), true);
        Promotion promo3 = new Promotion("LUXURY50", DiscountType.FLAT, 50.0, LocalDate.now().minusMonths(1), LocalDate.now().plusYears(1), true);
        promotionRepository.saveAll(Arrays.asList(promo1, promo2, promo3));

        // 3. Seed Hotels & Rooms
        // Hotel 1 - New York
        Hotel hotel1 = new Hotel(
                "Grand Palace Hotel & Suites",
                "Luxury 5-star oasis in the heart of downtown with skyline views, Michelin-starred dining, and a premium Roman bath wellness spa.",
                "100 Central Avenue",
                "New York",
                "USA",
                4.9,
                "WiFi, Swimming Pool, Spa, Fitness Center, Restaurant, Valet Parking, Concierge",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
        );
        Hotel savedH1 = hotelRepository.save(hotel1);

        Room h1r1 = new Room(savedH1, "Standard King Room", 190.0, 2, "1 King Bed, City View, Smart 4K TV, Rain Shower, Espresso Maker", 10, "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80");
        Room h1r2 = new Room(savedH1, "Deluxe Skyline Suite", 280.0, 3, "1 King Bed + Sofa Bed, Panoramic Skyline Balcony, Marble Bath, Lounge Access", 8, "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80");
        Room h1r3 = new Room(savedH1, "Presidential Royal Suite", 490.0, 4, "2 King Master Bedrooms, Rooftop Jacuzzi, Dedicated Butler Service, Private Dining", 3, "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80");
        roomRepository.saveAll(Arrays.asList(h1r1, h1r2, h1r3));

        // Hotel 2 - Miami
        Hotel hotel2 = new Hotel(
                "Azure Oceanfront Resort",
                "Private beachside sanctuary offering infinity pools, private cabanas, yacht excursions, and Mediterranean coastal gastronomy.",
                "450 Ocean Drive",
                "Miami",
                "USA",
                4.8,
                "WiFi, Beach Access, Infinity Pool, Bar & Lounge, Spa, Water Sports, Restaurant",
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
        );
        Hotel savedH2 = hotelRepository.save(hotel2);

        Room h2r1 = new Room(savedH2, "Ocean View King Room", 240.0, 2, "1 King Bed, Private Balcony, Direct Ocean View, Rain Shower", 12, "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80");
        Room h2r2 = new Room(savedH2, "Beachfront Villa Suite", 380.0, 4, "2 King Beds, Direct Beach Access, Private Plunge Pool, Butler Service", 5, "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80");
        roomRepository.saveAll(Arrays.asList(h2r1, h2r2));

        // Hotel 3 - Paris
        Hotel hotel3 = new Hotel(
                "The Ritz Heritage Palace",
                "Timeless Parisian elegance with Seine river views, private gardens, and haute cuisine.",
                "15 Place Vendome",
                "Paris",
                "France",
                5.0,
                "WiFi, Fine Dining, Concierge, Spa, Champagne Bar, Valet Parking",
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
        );
        Hotel savedH3 = hotelRepository.save(hotel3);

        Room h3r1 = new Room(savedH3, "Parisian Deluxe King", 350.0, 2, "1 King Bed, Courtyard View, Antique Furnishings, Marble Bathroom", 8, "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80");
        Room h3r2 = new Room(savedH3, "Eiffel View Grand Suite", 550.0, 3, "1 King Bed, Direct Eiffel Tower Views, Champagne Service, Luxury Tub", 4, "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80");
        roomRepository.saveAll(Arrays.asList(h3r1, h3r2));

        // Hotel 4 - Tokyo
        Hotel hotel4 = new Hotel(
                "Sakura Imperial Hotel",
                "Zen garden tranquility meets modern high-tech luxury in central Tokyo with Mount Fuji vistas.",
                "1-1 Chiyoda",
                "Tokyo",
                "Japan",
                4.9,
                "WiFi, Spa, Onsen Hot Springs, Tea Pavilion, Fine Dining, Concierge",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80"
        );
        Hotel savedH4 = hotelRepository.save(hotel4);
        Room h4r1 = new Room(savedH4, "Zen Executive Suite", 310.0, 2, "Tatami Lounge, King Bed, Private Onsen Hinoki Tub, High-Tech Amenities", 6, "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80");
        roomRepository.save(h4r1);

        // Hotel 5 - London
        Hotel hotel5 = new Hotel(
                "The Kensington Royal Suites",
                "Historic boutique residence overlooking Hyde Park with British afternoon tea and private butler service.",
                "88 Kensington High St",
                "London",
                "UK",
                4.7,
                "WiFi, Valet Parking, Restaurant, Cocktail Lounge, Fitness Center",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
        );
        Hotel savedH5 = hotelRepository.save(hotel5);
        Room h5r1 = new Room(savedH5, "Royal Club King", 260.0, 2, "King Bed, Hyde Park Views, Afternoon Tea Included, Rain Shower", 7, "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80");
        roomRepository.save(h5r1);

        // 4. Seed a sample confirmed booking for the customer
        Booking initialBooking = new Booking(
                "RES-202610-9X8K21",
                savedCustomer,
                h1r2,
                LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(13),
                2,
                756.0, // 3 nights @ 280 minus 10% promo
                BookingStatus.CONFIRMED,
                promo1
        );
        bookingRepository.save(initialBooking);

        System.out.println(">>> GrandStay Database Seeded Successfully with Admin, Customer, Hotels, Rooms & Promotions <<<");
    }
}
