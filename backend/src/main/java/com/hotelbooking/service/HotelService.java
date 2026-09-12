package com.hotelbooking.service;

import com.hotelbooking.dto.HotelRequest;
import com.hotelbooking.dto.HotelResponse;
import com.hotelbooking.entity.Hotel;
import com.hotelbooking.entity.Room;
import com.hotelbooking.exception.ResourceNotFoundException;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Transactional(readOnly = true)
    public List<HotelResponse> getAllHotels(String city, Double minRating, Double minPrice, Double maxPrice, String amenities) {
        List<Hotel> hotels;
        if (city != null && !city.trim().isEmpty()) {
            hotels = hotelRepository.searchHotels(city.trim(), minRating);
        } else if (minRating != null) {
            hotels = hotelRepository.searchHotels(null, minRating);
        } else {
            hotels = hotelRepository.findAll();
        }

        List<HotelResponse> responses = hotels.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        // Filter by price and amenities if provided
        if (minPrice != null || maxPrice != null || (amenities != null && !amenities.trim().isEmpty())) {
            List<String> reqAmenities = (amenities != null && !amenities.trim().isEmpty())
                    ? Arrays.stream(amenities.split(",")).map(String::trim).map(String::toLowerCase).collect(Collectors.toList())
                    : Collections.emptyList();

            responses = responses.stream().filter(h -> {
                double price = h.getMinPrice() != null ? h.getMinPrice() : 0.0;
                if (minPrice != null && price < minPrice) return false;
                if (maxPrice != null && price > maxPrice) return false;

                if (!reqAmenities.isEmpty() && h.getAmenities() != null) {
                    List<String> hAm = h.getAmenities().stream().map(String::toLowerCase).collect(Collectors.toList());
                    boolean containsAll = reqAmenities.stream().allMatch(ra -> hAm.stream().anyMatch(ha -> ha.contains(ra)));
                    if (!containsAll) return false;
                }
                return true;
            }).collect(Collectors.toList());
        }

        return responses;
    }

    @Transactional(readOnly = true)
    public HotelResponse getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        return mapToResponse(hotel);
    }

    @Transactional
    public HotelResponse createHotel(HotelRequest request) {
        Hotel hotel = new Hotel(
                request.getName(),
                request.getDescription(),
                request.getAddress(),
                request.getCity(),
                request.getCountry(),
                request.getStarRating() != null ? request.getStarRating() : 5.0,
                request.getAmenities() != null ? String.join(",", request.getAmenities()) : "",
                request.getImages() != null ? String.join(",", request.getImages()) : ""
        );

        Hotel saved = hotelRepository.save(hotel);
        return mapToResponse(saved);
    }

    @Transactional
    public HotelResponse updateHotel(Long id, HotelRequest request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        hotel.setName(request.getName());
        hotel.setDescription(request.getDescription());
        hotel.setAddress(request.getAddress());
        hotel.setCity(request.getCity());
        hotel.setCountry(request.getCountry());
        if (request.getStarRating() != null) hotel.setStarRating(request.getStarRating());
        if (request.getAmenities() != null) hotel.setAmenities(String.join(",", request.getAmenities()));
        if (request.getImages() != null) hotel.setImages(String.join(",", request.getImages()));

        Hotel updated = hotelRepository.save(hotel);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hotel not found with id: " + id);
        }
        hotelRepository.deleteById(id);
    }

    private HotelResponse mapToResponse(Hotel hotel) {
        HotelResponse res = new HotelResponse();
        res.setId(hotel.getId());
        res.setName(hotel.getName());
        res.setDescription(hotel.getDescription());
        res.setAddress(hotel.getAddress());
        res.setCity(hotel.getCity());
        res.setCountry(hotel.getCountry());
        res.setStarRating(hotel.getStarRating());

        if (hotel.getAmenities() != null && !hotel.getAmenities().trim().isEmpty()) {
            res.setAmenities(Arrays.asList(hotel.getAmenities().split("\\s*,\\s*")));
        } else {
            res.setAmenities(Collections.emptyList());
        }

        if (hotel.getImages() != null && !hotel.getImages().trim().isEmpty()) {
            res.setImages(Arrays.asList(hotel.getImages().split("\\s*,\\s*")));
        } else {
            res.setImages(Collections.emptyList());
        }

        List<Room> rooms = roomRepository.findByHotelId(hotel.getId());
        res.setTotalRooms(rooms.size());
        double minPrice = rooms.stream()
                .mapToDouble(Room::getPricePerNight)
                .min()
                .orElse(180.0);
        res.setMinPrice(minPrice);

        return res;
    }
}
