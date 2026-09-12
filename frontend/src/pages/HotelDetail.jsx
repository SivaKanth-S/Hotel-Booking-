import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hotelService } from '../services/hotelService';
import { roomService } from '../services/roomService';
import { BookingModal } from '../components/BookingModal';
import { Star, MapPin, Check, Users, Bed, Sparkles, Shield, ArrowLeft, Calendar } from 'lucide-react';

export const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date state for live availability
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 4);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(dayAfter.toISOString().split('T')[0]);

  // Modal state
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      setLoading(true);
      try {
        const hotelData = await hotelService.getHotelById(id);
        setHotel(hotelData);

        const roomsData = await roomService.getRoomsByHotel(id);
        setRooms(roomsData);
      } catch (err) {
        // Fallback demo hotel & rooms
        setHotel({
          id: Number(id),
          name: "Grand Palace Hotel & Suites",
          description: "Nestled in the epicenter of the metropolis, Grand Palace Hotel & Suites presents an unparalleled synthesis of classical grandeur and contemporary luxury. Featuring award-winning culinary dining, full-service wellness spa, panoramic skyline lounges, and bespoke round-the-clock concierge services.",
          address: "100 Central Avenue, Downtown",
          city: "New York",
          country: "United States",
          starRating: 4.9,
          amenities: ["High-speed WiFi", "Heated Swimming Pool", "Wellness Spa & Sauna", "24/7 Fitness Center", "Michelin-Starred Restaurant", "Valet Parking", "Cocktail Lounge"],
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
          ]
        });

        setRooms([
          {
            id: 1,
            hotelId: Number(id),
            category: "Standard King Room",
            pricePerNight: 190,
            capacity: 2,
            totalUnits: 10,
            amenities: ["1 King Bed", "City View", "Smart 4K TV", "Rain Shower", "Free High-Speed WiFi", "Espresso Maker"],
            images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"]
          },
          {
            id: 2,
            hotelId: Number(id),
            category: "Deluxe Skyline Suite",
            pricePerNight: 280,
            capacity: 3,
            totalUnits: 6,
            amenities: ["1 King Bed + Sofa Bed", "Panoramic Skyline Balcony", "Marble Bath with Soaking Tub", "Complimentary Lounge Access", "Mini Bar"],
            images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"]
          },
          {
            id: 3,
            hotelId: Number(id),
            category: "Presidential Royal Suite",
            pricePerNight: 490,
            capacity: 4,
            totalUnits: 2,
            amenities: ["2 King Master Bedrooms", "Private Rooftop Jacuzzi", "Dedicated Butler Service", "Private Dining Area", "Complimentary Vintage Champagne"],
            images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelAndRooms();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading luxury suite details...
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-heading)', marginBottom: '16px' }}>Hotel Not Found</h2>
        <Link to="/hotels" className="btn btn-primary">Back to Hotels</Link>
      </div>
    );
  }

  const amenitiesList = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : (typeof hotel.amenities === 'string' ? hotel.amenities.split(',').map(s => s.trim()) : []);

  const imagesList = Array.isArray(hotel.images)
    ? hotel.images
    : (typeof hotel.images === 'string' ? hotel.images.split(',').map(s => s.trim()) : []);

  const handleOpenBooking = (room) => {
    setSelectedRoomForBooking(room);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="container" style={{ padding: '30px 24px 60px 24px' }}>
      {/* Back Button */}
      <Link to="/hotels" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to all hotels
      </Link>

      {/* Hotel Title & Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 className="heading-serif" style={{ fontSize: '2.4rem', color: 'var(--text-heading)' }}>
              {hotel.name}
            </h1>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--accent-gold)',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>{hotel.starRating ? Number(hotel.starRating).toFixed(1) : '5.0'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            <MapPin size={16} color="var(--primary)" />
            <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-primary"><Shield size={13} /> Verified Luxury</span>
          <span className="badge badge-success"><Sparkles size={13} /> Best Rate Guaranteed</span>
        </div>
      </div>

      {/* High-Resolution Image Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: imagesList.length > 1 ? '2fr 1fr' : '1fr',
        gap: '16px',
        marginBottom: '40px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        height: '420px'
      }}>
        <img
          src={imagesList[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
          alt={hotel.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {imagesList.length > 1 && (
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
            <img
              src={imagesList[1] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'}
              alt={hotel.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <img
              src={imagesList[2] || imagesList[0]}
              alt={hotel.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      {/* Overview & Amenities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '60px' }} className="hotel-detail-grid">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '16px' }}>
            About the Property
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.95rem', marginBottom: '28px' }}>
            {hotel.description}
          </p>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '16px' }}>
            Property Amenities
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {amenitiesList.map((amenity, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-glass)',
                fontSize: '0.85rem',
                color: 'var(--text-primary)'
              }}>
                <Check size={14} color="var(--success)" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Date Selector Box */}
        <div className="glass-panel" style={{ padding: '24px', alignSelf: 'start' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--primary)" /> Check Date Availability
          </h3>
          <div className="form-group">
            <label className="form-label">Check-In Date</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Check-Out Date</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="form-input"
            />
          </div>
          <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass-hover)', fontSize: '0.8rem', color: 'var(--primary)' }}>
            &bull; Live availability is calculated per selected date range below.
          </div>
        </div>
      </div>

      {/* Room Categories Section */}
      <div>
        <div style={{ marginBottom: '28px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '8px' }}>Available Suites</span>
          <h2 className="heading-serif" style={{ fontSize: '2rem', color: 'var(--text-heading)' }}>
            Select Your Room Category
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {rooms.map((room) => {
            const roomAmenities = Array.isArray(room.amenities)
              ? room.amenities
              : (typeof room.amenities === 'string' ? room.amenities.split(',').map(s => s.trim()) : []);

            const roomImage = (Array.isArray(room.images) ? room.images[0] : (typeof room.images === 'string' ? room.images.split(',')[0] : null))
              || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={room.id}
                className="glass-panel"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '300px 1fr 220px',
                  gap: '24px',
                  padding: '24px',
                  alignItems: 'center'
                }}
              >
                {/* Room Image */}
                <div style={{ height: '180px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <img
                    src={roomImage}
                    alt={room.category}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Room Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                      {room.category}
                    </h3>
                    <span className="badge badge-primary">
                      <Users size={12} /> Up to {room.capacity || 2} Guests
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                    {roomAmenities.map((item, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)'
                      }}>
                        {item}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                    &check; Free cancellation up to 48h prior &bull; Instant Confirmation
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  borderLeft: '1px solid var(--border-glass)',
                  paddingLeft: '24px',
                  height: '100%'
                }}>
                  <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Rate per night</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                        ${room.pricePerNight}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ night</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(room)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Book Room
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Checkout Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        hotel={hotel}
        room={selectedRoomForBooking}
        initialDates={{ checkIn, checkOut }}
      />
    </div>
  );
};
