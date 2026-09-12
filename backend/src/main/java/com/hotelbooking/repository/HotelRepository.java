package com.hotelbooking.repository;

import com.hotelbooking.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT h FROM Hotel h WHERE (:city IS NULL OR LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(h.name) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (:minRating IS NULL OR h.starRating >= :minRating)")
    List<Hotel> searchHotels(@Param("city") String city, @Param("minRating") Double minRating);

    List<Hotel> findByCityIgnoreCase(String city);
}
