package com.hotelbooking.config;

import com.hotelbooking.entity.*;
import com.hotelbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Seeds initial sample data into MySQL on startup.
 * Ensures Tamil Nadu luxury hotels, rooms, availability and users exist.
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
        // Ensure requested admin user always exists and has admin123 password
        userRepository.findByEmail("admin@gmail.com").ifPresentOrElse(
                existingAdmin -> {
                    existingAdmin.setPasswordHash(passwordEncoder.encode("admin123"));
                    existingAdmin.setRole(Role.ADMIN);
                    userRepository.save(existingAdmin);
                    System.out.println("[DataInitializer] Admin user admin@gmail.com verified.");
                },
                () -> {
                    User admin = new User("Admin", "admin@gmail.com",
                            passwordEncoder.encode("admin123"), Role.ADMIN);
                    userRepository.save(admin);
                    System.out.println("[DataInitializer] Admin user admin@gmail.com created.");
                }
        );

        // Ensure customer user alice@example.com exists
        userRepository.findByEmail("alice@example.com").ifPresentOrElse(
                existingAlice -> {
                    existingAlice.setPasswordHash(passwordEncoder.encode("Alice@123"));
                    existingAlice.setRole(Role.CUSTOMER);
                    userRepository.save(existingAlice);
                },
                () -> {
                    User alice = new User("Alice Smith", "alice@example.com",
                            passwordEncoder.encode("Alice@123"), Role.CUSTOMER);
                    userRepository.save(alice);
                    System.out.println("[DataInitializer] Customer alice@example.com created.");
                }
        );

        // Ensure customer user bob@example.com exists
        userRepository.findByEmail("bob@example.com").ifPresentOrElse(
                b -> {},
                () -> {
                    User bob = new User("Bob Johnson", "bob@example.com",
                            passwordEncoder.encode("Bob@123"), Role.CUSTOMER);
                    userRepository.save(bob);
                }
        );

        // Ensure Hotel 1 is The Grand Chola Palace with Chennai
        Hotel h1 = hotelRepository.findById(1L).orElse(null);
        if (h1 != null && !"The Grand Chola Palace".equals(h1.getName())) {
            h1.setName("The Grand Chola Palace");
            h1.setDescription("A majestic 5-star retreat in the heart of Chennai blending Chola dynasty architecture with ultra-modern luxury, offering panoramic Marina Beach views, award-winning South Indian dining, and an imperial wellness spa.");
            h1.setAddress("100 Anna Salai, Guindy & Teynampet");
            h1.setCity("Chennai");
            h1.setCountry("Tamil Nadu, India");
            h1.setStarRating(4.9);
            h1.setAmenities("High-Speed WiFi,Rooftop Pool,Ayurvedic Spa,Fitness Centre,Valet Parking,Marina View Lounge,Chettinad Fine Dining");
            h1.setImages("https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=85,https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85,https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85");
            hotelRepository.save(h1);

            // Update rooms for Hotel 1 to match Chola categories
            List<Room> h1Rooms = roomRepository.findByHotelId(1L);
            if (h1Rooms.size() >= 3) {
                h1Rooms.get(0).setCategory("Chola Deluxe Room");
                h1Rooms.get(0).setPricePerNight(8500.0);
                h1Rooms.get(0).setCapacity(2);
                h1Rooms.get(0).setAmenities("1 King Bed,City View,Smart 4K TV,Rain Shower,Free High-Speed WiFi,Filter Coffee Bar");
                h1Rooms.get(0).setTotalUnits(12);

                h1Rooms.get(1).setCategory("Marina Panoramic Suite");
                h1Rooms.get(1).setPricePerNight(12500.0);
                h1Rooms.get(1).setCapacity(3);
                h1Rooms.get(1).setAmenities("1 King Bed + Daybed,Marina Beach Horizon View,Deep Soaking Marble Tub,Lounge Access,Mini Bar");
                h1Rooms.get(1).setTotalUnits(6);

                h1Rooms.get(2).setCategory("Imperial Dynasty Royal Suite");
                h1Rooms.get(2).setPricePerNight(18500.0);
                h1Rooms.get(2).setCapacity(4);
                h1Rooms.get(2).setAmenities("2 Master Bedrooms,Private Terrace Jacuzzi,Dedicated Butler Service,Chettinad Private Dining");
                h1Rooms.get(2).setTotalUnits(2);

                roomRepository.saveAll(h1Rooms);
            }
        }

        // Seed remaining Tamil Nadu hotels if not already present
        seedTamilNaduHotelsIfMissing();

        // Ensure promotions exist
        LocalDate today = LocalDate.now();
        if (promotionRepository.findByCodeIgnoreCase("WELCOME10").isEmpty()) {
            promotionRepository.save(new Promotion("WELCOME10", DiscountType.PERCENTAGE, 10.0, today, today.plusYears(1), true));
        }
        if (promotionRepository.findByCodeIgnoreCase("SUMMER25").isEmpty()) {
            promotionRepository.save(new Promotion("SUMMER25", DiscountType.PERCENTAGE, 25.0, today, today.plusYears(1), true));
        }
        if (promotionRepository.findByCodeIgnoreCase("FLAT500").isEmpty()) {
            promotionRepository.save(new Promotion("FLAT500", DiscountType.FLAT, 500.0, today, today.plusYears(1), true));
        }

        // Ensure room availability for next 180 days for all rooms
        ensureRoomAvailability();

        System.out.println("[DataInitializer] Data sync complete. Total hotels: " + hotelRepository.count() + ", Total rooms: " + roomRepository.count());
    }

    private void seedTamilNaduHotelsIfMissing() {
        if (hotelRepository.count() >= 10) {
            return;
        }

        // 2. Kovai Nilgiris Resort & Spa
        createHotelWithRoomsIfMissing(
                "Kovai Nilgiris Resort & Spa",
                "Nestled at the scenic gateway of the Nilgiri hills in Coimbatore, offering Western Ghats views and organic spice plantation trails.",
                "32 Avinashi Road, Peelamedu", "Coimbatore", "Tamil Nadu, India", 4.8,
                "WiFi,Infinity Pool,Ayurveda Centre,Organic Restaurant,Mountain View,Spice Garden Walk",
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85",
                List.of(
                        new RoomData("Kongu Valley Deluxe Room", 6200.0, 2, 10, "1 King Bed,Western Ghats View,Smart TV,Balcony", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"),
                        new RoomData("Nilgiri Foothills Cottage", 9800.0, 3, 5, "Private Garden Villa,Outdoor Rain Shower,Fireplace", "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80")
                )
        );

        // 3. Meenakshi Heritage Grand
        createHotelWithRoomsIfMissing(
                "Meenakshi Heritage Grand",
                "Located mere steps from the legendary Meenakshi Amman Temple in Madurai, offering temple-view suites and Dravidian courtyards.",
                "15 West Perumal Maistry Street", "Madurai", "Tamil Nadu, India", 5.0,
                "WiFi,Temple View Rooms,Chettinad Restaurant,Cultural Tours,Ayurvedic Spa,Temple Shuttle",
                "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=85",
                List.of(
                        new RoomData("Temple View Heritage Room", 7000.0, 2, 14, "Gopuram View Window,Rosewood Furnishings,Free Breakfast", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"),
                        new RoomData("Pandyan Royal Suite", 11500.0, 3, 4, "Private Temple View Balcony,Separate Living Room,Marble Bath", "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=800&q=80")
                )
        );

        // 4. Ooty Fern Hill Palace
        createHotelWithRoomsIfMissing(
                "Ooty Fern Hill Palace",
                "A restored colonial-era palace in the misty Nilgiris surrounded by eucalyptus groves and rolling tea gardens.",
                "Fern Hill Road, Ooty", "Nilgiris (Ooty)", "Tamil Nadu, India", 4.9,
                "WiFi,Fireplace Suites,Tea Garden Walk,Heritage Dining,Heated Rooms",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85",
                List.of(
                        new RoomData("Victorian Fireplace Suite", 9500.0, 2, 8, "Working Fireplace,Nilgiri Tea Garden View,Antique Teak Bed", "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80"),
                        new RoomData("Governor’s Heritage Villa", 16000.0, 4, 3, "2 Bedrooms,Private Mountain Lawn,Personal Butler", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80")
                )
        );

        // 5. Thanjavur Brihadeeswara Retreat
        createHotelWithRoomsIfMissing(
                "Thanjavur Brihadeeswara Retreat",
                "A culturally rich sanctuary adjacent to the UNESCO World Heritage Brihadeeswara Temple.",
                "4 Nayak Road, Thanjavur", "Thanjavur", "Tamil Nadu, India", 4.7,
                "WiFi,Cultural Performances,Heritage Pool,Temple Tours,Ayurvedic Massage",
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85",
                List.of(
                        new RoomData("Chola Craft Deluxe Room", 5500.0, 2, 12, "Thanjavur Painting Art Decor,Courtyard View,Free Breakfast", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"),
                        new RoomData("Nayak Heritage Suite", 8500.0, 3, 4, "Private Garden Veranda,Temple Architecture Views", "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80")
                )
        );

        // 6. Kanyakumari Horizon Resort
        createHotelWithRoomsIfMissing(
                "Kanyakumari Horizon Resort",
                "Located right at India's southernmost tip where the Indian Ocean, Arabian Sea, and Bay of Bengal unite.",
                "Bypass Road, Beach Front", "Kanyakumari", "Tamil Nadu, India", 4.8,
                "WiFi,Sea-View Cottages,Sunrise Observation Deck,Coastal Seafood Restaurant",
                "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=85",
                List.of(
                        new RoomData("Three-Seas Sunrise Cottage", 6800.0, 2, 8, "Unobstructed Sea View,Private Sunrise Balcony,Free WiFi", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"),
                        new RoomData("Oceanfront Premium Villa", 11000.0, 4, 3, "Direct Beach Access,Panoramic Ocean Terrace,Outdoor Jacuzzi", "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80")
                )
        );

        // 7. Salem Steel City Suites
        createHotelWithRoomsIfMissing(
                "Salem Steel City Suites",
                "A contemporary business and leisure hotel in Salem with swift connectivity to Yercaud hill station.",
                "18 Sarada College Road, Salem", "Salem", "Tamil Nadu, India", 4.5,
                "WiFi,Rooftop Restaurant,Business Centre,Pool,Gym",
                "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85",
                List.of(
                        new RoomData("Executive Business King", 4200.0, 2, 15, "1 King Bed,Ergonomic Workstation,High-Speed WiFi", "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80"),
                        new RoomData("Yercaud Vista Club Suite", 6500.0, 3, 6, "Hill View Lounge,Mini Bar,Marble Bath", "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80")
                )
        );

        // 8. Trichy Rockfort River View
        createHotelWithRoomsIfMissing(
                "Trichy Rockfort River View",
                "Perched along the scenic banks of the sacred Kaveri River with views of the Rockfort Temple.",
                "22 Rockfort Road, Tiruchirappalli", "Tiruchirappalli", "Tamil Nadu, India", 4.6,
                "WiFi,River View Rooms,Temple Tours,Traditional Cuisine,Spa",
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",
                List.of(
                        new RoomData("Kaveri Riverfront Deluxe", 4800.0, 2, 12, "Riverfront Balcony,Rockfort Temple View,Smart TV", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"),
                        new RoomData("Rockfort Heritage Suite", 7500.0, 3, 5, "Panoramic River & Temple Vista,Gourmet Breakfast", "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80")
                )
        );

        // 9. Tirunelveli Pearl City Resort
        createHotelWithRoomsIfMissing(
                "Tirunelveli Pearl City Resort",
                "Celebrating southern traditions with tropical garden pools and Nellai feast dining.",
                "7 High Ground Road, Tirunelveli", "Tirunelveli", "Tamil Nadu, India", 4.5,
                "WiFi,Garden Pool,Nellai Saiva Restaurant,Waterfall Tours,Ayurveda Centre",
                "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?auto=format&fit=crop&w=1200&q=85",
                List.of(
                        new RoomData("Nellai Garden Room", 3900.0, 2, 14, "Tropical Garden View,King Bed,Complimentary Halwa Box,WiFi", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"),
                        new RoomData("Courtallam Royal Suite", 6200.0, 3, 4, "Private Poolside Veranda,Spacious Living Area", "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?auto=format&fit=crop&w=800&q=80")
                )
        );

        // 10. Vellore Fort Heritage Hotel
        createHotelWithRoomsIfMissing(
                "Vellore Fort Heritage Hotel",
                "Flanked by the historic 16th-century stone ramparts of the Vellore Fort.",
                "10 Fort Road, Vellore", "Vellore", "Tamil Nadu, India", 4.4,
                "WiFi,Fort View Rooms,Heritage Restaurant,Garden Courtyard",
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85",
                List.of(
                        new RoomData("Fort View Classic Room", 3500.0, 2, 10, "Granite Fort View,Queen Bed,Smart TV,Free WiFi", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"),
                        new RoomData("Imperial Fort Royal Suite", 5800.0, 3, 3, "Panoramic Fort Rampart Terrace,King Bed,Breakfast Included", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80")
                )
        );
    }

    private void createHotelWithRoomsIfMissing(String name, String desc, String addr, String city, String country,
                                               double rating, String amenities, String images, List<RoomData> rooms) {
        if (hotelRepository.findAll().stream().anyMatch(h -> name.equalsIgnoreCase(h.getName()))) {
            return;
        }

        Hotel hotel = new Hotel(name, desc, addr, city, country, rating, amenities, images);
        Hotel savedHotel = hotelRepository.save(hotel);

        List<Room> roomEntities = new ArrayList<>();
        for (RoomData rd : rooms) {
            Room r = new Room(savedHotel, rd.category, rd.price, rd.capacity, rd.amenities, rd.totalUnits, rd.image);
            roomEntities.add(r);
        }
        roomRepository.saveAll(roomEntities);
    }

    private void ensureRoomAvailability() {
        LocalDate today = LocalDate.now();
        List<Room> allRooms = roomRepository.findAll();
        for (Room room : allRooms) {
            for (int i = 0; i < 90; i++) {
                LocalDate date = today.plusDays(i);
                if (roomAvailabilityRepository.findByRoomIdAndDate(room.getId(), date).isEmpty()) {
                    RoomAvailability avail = new RoomAvailability(room, date, room.getTotalUnits());
                    roomAvailabilityRepository.save(avail);
                }
            }
        }
    }

    private static class RoomData {
        String category;
        double price;
        int capacity;
        int totalUnits;
        String amenities;
        String image;

        RoomData(String category, double price, int capacity, int totalUnits, String amenities, String image) {
            this.category = category;
            this.price = price;
            this.capacity = capacity;
            this.totalUnits = totalUnits;
            this.amenities = amenities;
            this.image = image;
        }
    }
}
