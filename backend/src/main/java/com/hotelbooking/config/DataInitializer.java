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

        // 3. Seed Tamil Nadu Hotels & Rooms
        // Hotel 1 - Chennai
        Hotel hotel1 = new Hotel(
                "The Grand Chola Palace",
                "A majestic 5-star retreat in the heart of Chennai blending Chola dynasty architecture with ultra-modern luxury, offering panoramic Marina Beach views and award-winning dining.",
                "100 Anna Salai, Guindy & Teynampet",
                "Chennai",
                "Tamil Nadu, India",
                4.9,
                "WiFi, Swimming Pool, Ayurvedic Spa, Fitness Center, Restaurant, Valet Parking, Concierge",
                "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=85,https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85,https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85"
        );
        Hotel savedH1 = hotelRepository.save(hotel1);

        Room h1r1 = new Room(savedH1, "Chola Deluxe Room", 8500.0, 2, "1 King Bed, City View, Smart 4K TV, Rain Shower, Espresso Maker", 10, "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80");
        Room h1r2 = new Room(savedH1, "Marina Panoramic Suite", 12500.0, 3, "1 King Bed + Daybed, Marina Beach Horizon View, Deep Soaking Marble Tub, Lounge Access", 8, "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80");
        Room h1r3 = new Room(savedH1, "Imperial Dynasty Royal Suite", 18500.0, 4, "2 King Master Bedrooms, Rooftop Jacuzzi, Dedicated Butler Service, Private Dining", 3, "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80");
        roomRepository.saveAll(Arrays.asList(h1r1, h1r2, h1r3));

        // Hotel 2 - Coimbatore
        Hotel hotel2 = new Hotel(
                "Kovai Nilgiris Resort & Spa",
                "Nestled at the scenic gateway of the Nilgiri hills in Coimbatore, offering Western Ghats valley views, organic spice plantation trails, and authentic Kongu cuisine.",
                "32 Avinashi Road, Peelamedu",
                "Coimbatore",
                "Tamil Nadu, India",
                4.8,
                "WiFi, Infinity Pool, Ayurveda Centre, Organic Restaurant, Mountain View, Spice Garden Walk",
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85,https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85"
        );
        Hotel savedH2 = hotelRepository.save(hotel2);

        Room h2r1 = new Room(savedH2, "Kongu Valley Deluxe Room", 6200.0, 2, "1 King Bed, Western Ghats View, Smart TV, Herbal Spa Toiletries, Balcony", 12, "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80");
        Room h2r2 = new Room(savedH2, "Nilgiri Foothills Cottage", 9800.0, 4, "Private Garden Villa, Outdoor Rain Shower, Organic Breakfast Included, Fireplace", 5, "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80");
        roomRepository.saveAll(Arrays.asList(h2r1, h2r2));

        // Hotel 3 - Madurai
        Hotel hotel3 = new Hotel(
                "Meenakshi Heritage Grand",
                "Located mere steps from the legendary Meenakshi Amman Temple in Madurai, offering temple-view suites, carved courtyards, and authentic Chettinad royal thali banquets.",
                "15 West Perumal Maistry Street",
                "Madurai",
                "Tamil Nadu, India",
                5.0,
                "WiFi, Temple View Rooms, Chettinad Restaurant, Cultural Tours, Ayurvedic Spa, Temple Shuttle",
                "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=85,https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85"
        );
        Hotel savedH3 = hotelRepository.save(hotel3);

        Room h3r1 = new Room(savedH3, "Temple View Heritage Room", 7000.0, 2, "Gopuram View Window, Rosewood Furnishings, Dravidian Brass Decor, Free Breakfast", 8, "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80");
        Room h3r2 = new Room(savedH3, "Pandyan Royal Suite", 11500.0, 3, "Private Temple View Balcony, Chettinad Thali Included, Separate Living Room, Marble Bath", 4, "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=800&q=80");
        roomRepository.saveAll(Arrays.asList(h3r1, h3r2));

        // Hotel 4 - Nilgiris (Ooty)
        Hotel hotel4 = new Hotel(
                "Ooty Fern Hill Palace",
                "A restored colonial-era palace in the misty Nilgiris surrounded by eucalyptus groves and rolling emerald tea gardens, featuring crackling fireplaces.",
                "Fern Hill Road, Ooty",
                "Nilgiris (Ooty)",
                "Tamil Nadu, India",
                4.9,
                "WiFi, Fireplace Suites, Tea Garden Walk, Heritage Dining, Horseback Riding, Heated Rooms",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85,https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85"
        );
        Hotel savedH4 = hotelRepository.save(hotel4);
        Room h4r1 = new Room(savedH4, "Victorian Fireplace Suite", 9500.0, 2, "Working Fireplace, Nilgiri Tea Garden View, Antique Teak Bed, High Tea Service", 6, "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80");
        roomRepository.save(h4r1);

        // Hotel 5 - Thanjavur
        Hotel hotel5 = new Hotel(
                "Thanjavur Brihadeeswara Retreat",
                "A culturally rich sanctuary adjacent to the UNESCO World Heritage Brihadeeswara Temple, offering Bharatanatyam recitals and Kaveri delta tranquility.",
                "4 Nayak Road",
                "Thanjavur",
                "Tamil Nadu, India",
                4.7,
                "WiFi, Cultural Performances, Heritage Pool, Temple Tours, Art Workshops, Ayurvedic Massage",
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85,https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85"
        );
        Hotel savedH5 = hotelRepository.save(hotel5);
        Room h5r1 = new Room(savedH5, "Chola Craft Deluxe Room", 5500.0, 2, "Thanjavur Painting Art Decor, Courtyard View, Free Breakfast, Rain Shower", 7, "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80");
        roomRepository.save(h5r1);

        // 4. Seed a sample confirmed booking for the customer
        Booking initialBooking = new Booking(
                "RES-202610-TN8K21",
                savedCustomer,
                h1r2,
                LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(13),
                2,
                33750.0, // 3 nights @ 12500 minus 10% promo
                BookingStatus.CONFIRMED,
                promo1
        );
        bookingRepository.save(initialBooking);

        System.out.println(">>> GrandStay Database Seeded Successfully with Tamil Nadu Hotels, Suites, Districts & Promotions <<<");
    }
}
