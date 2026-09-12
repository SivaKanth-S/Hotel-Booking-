package com.hotelbooking.repository;

import com.hotelbooking.entity.RoomAvailability;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomAvailabilityRepository extends JpaRepository<RoomAvailability, Long> {

    Optional<RoomAvailability> findByRoomIdAndDate(Long roomId, LocalDate date);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT ra FROM RoomAvailability ra WHERE ra.room.id = :roomId AND ra.date = :date")
    Optional<RoomAvailability> findByRoomIdAndDateWithLock(@Param("roomId") Long roomId, @Param("date") LocalDate date);

    @Query("SELECT ra FROM RoomAvailability ra WHERE ra.room.id = :roomId AND ra.date >= :startDate AND ra.date < :endDate")
    List<RoomAvailability> findByRoomIdAndDateRange(
        @Param("roomId") Long roomId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
