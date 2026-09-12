package com.hotelbooking.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "room_availability", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"room_id", "date"})
})
public class RoomAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "units_available", nullable = false)
    private Integer unitsAvailable;

    public RoomAvailability() {
    }

    public RoomAvailability(Room room, LocalDate date, Integer unitsAvailable) {
        this.room = room;
        this.date = date;
        this.unitsAvailable = unitsAvailable;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getUnitsAvailable() {
        return unitsAvailable;
    }

    public void setUnitsAvailable(Integer unitsAvailable) {
        this.unitsAvailable = unitsAvailable;
    }
}
