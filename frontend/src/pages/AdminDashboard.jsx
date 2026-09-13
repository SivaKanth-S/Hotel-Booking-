import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { hotelService } from '../services/hotelService';
import { roomService } from '../services/roomService';
import { bookingService } from '../services/bookingService';
import { userService } from '../services/userService';

import { Shield, Plus, Building2, Bed, CalendarCheck, DollarSign, X, Check, Trash2, Edit, Users, Mail, User, Phone, Search } from 'lucide-react';
import { TN_DISTRICTS, TN_HOTELS } from '../data/tnData';
import { handleImageError, DEFAULT_HOTEL_IMAGE, DEFAULT_ROOM_IMAGE } from '../utils/imageUtils';

export const AdminDashboard = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('HOTELS'); // 'HOTELS', 'BOOKINGS', 'CUSTOMERS'
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [selectedHotelForRoom, setSelectedHotelForRoom] = useState(null);

  // New Hotel Form State
  const [hotelForm, setHotelForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: 'Tamil Nadu, India',
    starRating: 4.8,
    amenities: 'WiFi, Swimming Pool, Ayurvedic Spa, Fitness Centre, Restaurant, Valet Parking',
    images: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=85'
  });

  // New Room Form State
  const [roomForm, setRoomForm] = useState({
    hotelId: '',
    category: 'Deluxe Suite',
    pricePerNight: 5500,
    capacity: 2,
    totalUnits: 10,
    amenities: 'King Bed, Temple View, Smart TV, Mini Bar, Ayurveda Kit',
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [hotelsData, bookingsData, usersData] = await Promise.all([
        hotelService.getAllHotels(),
        bookingService.getAllBookingsAdmin(),
        userService.getAllUsers().catch(() => [])
      ]);
      setHotels(hotelsData || []);
      setBookings(bookingsData || []);
      setCustomers(usersData || []);
    } catch (err) {
      // Fallback data if backend is offline
      setHotels(TN_HOTELS.map(h => ({
        id: h.id,
        name: h.name,
        city: h.city,
        country: h.country,
        starRating: h.starRating,
        minPrice: h.minPrice,
        images: h.images
      })));
      setBookings([
        {
          id: 101,
          reservationNumber: "RES-202609-TN8K21",
          userId: 1,
          userName: "Alice Smith",
          userEmail: "alice@example.com",
          numGuests: 2,
          hotelName: "The Grand Chola Palace",
          roomCategory: "Chola Heritage Suite",
          checkInDate: "2026-10-15",
          checkOutDate: "2026-10-18",
          totalPrice: 25500,
          status: "CONFIRMED"
        },
        {
          id: 102,
          reservationNumber: "RES-202608-TN2L89",
          userId: 2,
          userName: "Bob Johnson",
          userEmail: "bob@example.com",
          numGuests: 2,
          hotelName: "Meenakshi Heritage Grand",
          roomCategory: "Temple View Heritage Room",
          checkInDate: "2026-08-01",
          checkOutDate: "2026-08-05",
          totalPrice: 14000,
          status: "CONFIRMED"
        },
        {
          id: 103,
          reservationNumber: "RES-202609-TN4P12",
          userId: 3,
          userName: "Test Customer",
          userEmail: "customer@example.com",
          numGuests: 1,
          hotelName: "Heritage Haveli",
          roomCategory: "Royal Suite",
          checkInDate: "2026-11-01",
          checkOutDate: "2026-11-04",
          totalPrice: 45000,
          status: "CONFIRMED"
        }
      ]);
      setCustomers([
        { id: 1, name: "Alice Smith", email: "alice@example.com", role: "CUSTOMER", createdAt: "2026-09-01T10:00:00" },
        { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "CUSTOMER", createdAt: "2026-09-05T14:30:00" },
        { id: 3, name: "Test Customer", email: "customer@example.com", role: "CUSTOMER", createdAt: "2026-09-10T12:00:00" },
        { id: 4, name: "Administrator", email: "admin@gmail.com", role: "ADMIN", createdAt: "2026-08-15T09:00:00" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin]);

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...hotelForm,
        starRating: Number(hotelForm.starRating),
        amenities: hotelForm.amenities.split(',').map(s => s.trim()),
        images: hotelForm.images.split(',').map(s => s.trim())
      };
      await hotelService.createHotel(payload);
      showSuccess('Hotel property created successfully!');
      setIsAddHotelOpen(false);
      loadData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create hotel');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...roomForm,
        hotelId: selectedHotelForRoom?.id || Number(roomForm.hotelId),
        pricePerNight: Number(roomForm.pricePerNight),
        capacity: Number(roomForm.capacity),
        totalUnits: Number(roomForm.totalUnits),
        amenities: roomForm.amenities.split(',').map(s => s.trim()),
        images: roomForm.images.split(',').map(s => s.trim())
      };
      await roomService.createRoom(payload);
      showSuccess('Room category created successfully!');
      setIsAddRoomOpen(false);
      loadData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create room');
    }
  };

  const handleDeleteHotel = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel and its room inventory?')) return;
    try {
      await hotelService.deleteHotel(id);
      showSuccess('Hotel deleted successfully');
      setHotels((prev) => prev.filter(h => h.id !== id));
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete hotel');
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this guest reservation? Room inventory will be restored.')) return;
    try {
      await bookingService.cancelBooking(id);
      showSuccess('Booking cancelled successfully and room inventory restored.');
      loadData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const filteredCustomers = customers.filter(c =>
    (c.name || '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.role || '').toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredBookings = bookings.filter(b =>
    (b.reservationNumber || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
    (b.hotelName || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
    (b.userName || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
    (b.userEmail || '').toLowerCase().includes(bookingSearch.toLowerCase()) ||
    (b.roomCategory || '').toLowerCase().includes(bookingSearch.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-primary"><Shield size={13} /> Admin Console</span>
          </div>
          <h1 className="heading-serif" style={{ fontSize: '2.4rem', color: 'var(--text-heading)' }}>
            Hotel & Guest Management
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsAddHotelOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add Hotel
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} color="var(--primary)" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Properties</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)' }}>{hotels.length}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarCheck size={24} color="var(--success)" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Bookings</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)' }}>{bookings.length}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} color="var(--primary)" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Registered Guests</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)' }}>{customers.length}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color="var(--accent-gold)" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Confirmed Revenue</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>₹{Number(totalRevenue).toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('HOTELS')}
          style={{
            background: activeTab === 'HOTELS' ? 'var(--primary-light)' : 'transparent',
            borderColor: activeTab === 'HOTELS' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'HOTELS' ? 'var(--primary)' : 'var(--text-secondary)',
            padding: '8px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Building2 size={16} /> Hotel Properties ({hotels.length})
        </button>
        <button
          onClick={() => setActiveTab('BOOKINGS')}
          style={{
            background: activeTab === 'BOOKINGS' ? 'var(--primary-light)' : 'transparent',
            borderColor: activeTab === 'BOOKINGS' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'BOOKINGS' ? 'var(--primary)' : 'var(--text-secondary)',
            padding: '8px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CalendarCheck size={16} /> Guest Reservations ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('CUSTOMERS')}
          style={{
            background: activeTab === 'CUSTOMERS' ? 'var(--primary-light)' : 'transparent',
            borderColor: activeTab === 'CUSTOMERS' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'CUSTOMERS' ? 'var(--primary)' : 'var(--text-secondary)',
            padding: '8px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={16} /> Registered Customers ({customers.length})
        </button>
      </div>

      {/* TAB 1: HOTELS */}
      {activeTab === 'HOTELS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={Array.isArray(hotel.images) ? hotel.images[0] : (typeof hotel.images === 'string' ? hotel.images.split(',')[0] : DEFAULT_HOTEL_IMAGE)}
                  alt={hotel.name}
                  style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  onError={(e) => handleImageError(e, DEFAULT_HOTEL_IMAGE)}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '4px' }}>
                    {hotel.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {hotel.city}, {hotel.country} &bull; Rating: {hotel.starRating}★ &bull; Base Price: ₹{(hotel.minPrice || 5000).toLocaleString('en-IN')}/night
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setSelectedHotelForRoom(hotel);
                    setRoomForm((prev) => ({ ...prev, hotelId: hotel.id }));
                    setIsAddRoomOpen(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Bed size={14} /> Add Room Category
                </button>
                <button
                  onClick={() => handleDeleteHotel(hotel.id)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BOOKINGS (WITH CUSTOMER DETAILS) */}
      {activeTab === 'BOOKINGS' && (
        <div>
          {/* Search bar */}
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '380px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search by customer name, email, or reservation #..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '16px' }}>Reservation #</th>
                  <th style={{ padding: '16px' }}>Customer / Guest</th>
                  <th style={{ padding: '16px' }}>Hotel & Room</th>
                  <th style={{ padding: '16px' }}>Dates</th>
                  <th style={{ padding: '16px' }}>Guests</th>
                  <th style={{ padding: '16px' }}>Total Amount</th>
                  <th style={{ padding: '16px' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No matching reservations found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '16px', fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                        {b.reservationNumber}
                      </td>

                      {/* Customer Details Column */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            flexShrink: 0
                          }}>
                            {(b.userName || 'G').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-heading)', fontWeight: 600 }}>
                              {b.userName || 'Guest Traveler'}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={11} /> {b.userEmail || 'customer@example.com'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Hotel & Room */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{b.hotelName}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{b.roomCategory}</div>
                      </td>

                      {/* Stay Dates */}
                      <td style={{ padding: '16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {b.checkInDate} &rarr; {b.checkOutDate}
                      </td>

                      {/* Guests */}
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                        {b.numGuests || 2} {b.numGuests === 1 ? 'Guest' : 'Guests'}
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '16px', fontWeight: 700, color: 'var(--success)', whiteSpace: 'nowrap' }}>
                        ₹{Number(b.totalPrice).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px' }}>
                        <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                          {b.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="btn btn-danger btn-sm"
                            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                          >
                            Cancel Stay
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMERS / GUEST DIRECTORY */}
      {activeTab === 'CUSTOMERS' && (
        <div>
          {/* Customer Search bar */}
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '380px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '16px' }}>Customer ID</th>
                  <th style={{ padding: '16px' }}>Full Name</th>
                  <th style={{ padding: '16px' }}>Email Address</th>
                  <th style={{ padding: '16px' }}>Account Role</th>
                  <th style={{ padding: '16px' }}>Total Bookings</th>
                  <th style={{ padding: '16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No registered customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => {
                    const custBookings = bookings.filter(b => b.userId === cust.id || b.userEmail === cust.email);
                    return (
                      <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>
                          #{cust.id}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: cust.role === 'ADMIN' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              flexShrink: 0
                            }}>
                              {(cust.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                              {cust.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Mail size={13} color="var(--primary)" />
                            <span>{cust.email}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span className={`badge ${cust.role === 'ADMIN' ? 'badge-primary' : 'badge-secondary'}`} style={{ fontSize: '0.72rem' }}>
                            {cust.role}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-heading)' }}>
                          {custBookings.length} {custBookings.length === 1 ? 'Booking' : 'Bookings'}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Hotel Modal */}
      {isAddHotelOpen && (
        <div className="modal-overlay" onClick={() => setIsAddHotelOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-heading)', fontWeight: 700 }}>Add New Hotel Property</h2>
              <button onClick={() => setIsAddHotelOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateHotel}>
              <div className="form-group">
                <label className="form-label">Hotel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Grand Mirage"
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Tamil Nadu District</label>
                  <select
                    required
                    value={hotelForm.city}
                    onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                    className="form-select"
                    id="admin-district-select"
                  >
                    <option value="">-- Select District --</option>
                    {TN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">State / Country</label>
                  <input
                    type="text"
                    readOnly
                    value="Tamil Nadu, India"
                    className="form-input"
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Anna Salai, Teynampet"
                  value={hotelForm.address}
                  onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  required
                  value={hotelForm.description}
                  onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                  className="form-textarea"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Star Rating (1.0 to 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={hotelForm.starRating}
                  onChange={(e) => setHotelForm({ ...hotelForm, starRating: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amenities (Comma separated)</label>
                <input
                  type="text"
                  value={hotelForm.amenities}
                  onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hotel Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={hotelForm.images}
                  onChange={(e) => setHotelForm({ ...hotelForm, images: e.target.value })}
                  className="form-input"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }}>
                Save & Publish Hotel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isAddRoomOpen && (
        <div className="modal-overlay" onClick={() => setIsAddRoomOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-heading)', fontWeight: 700 }}>
                Add Room for {selectedHotelForRoom?.name}
              </h2>
              <button onClick={() => setIsAddRoomOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateRoom}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Presidential Penthouse Suite"
                  value={roomForm.category}
                  onChange={(e) => setRoomForm({ ...roomForm, category: e.target.value })}
                  className="form-input"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Price / Night (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={roomForm.pricePerNight}
                    onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity (Guests)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Units</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={roomForm.totalUnits}
                    onChange={(e) => setRoomForm({ ...roomForm, totalUnits: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Room Amenities (Comma separated)</label>
                <input
                  type="text"
                  value={roomForm.amenities}
                  onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Room Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={roomForm.images}
                  onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
                  className="form-input"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }}>
                Create Room Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
