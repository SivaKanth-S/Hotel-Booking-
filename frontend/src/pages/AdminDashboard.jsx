import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { hotelService } from '../services/hotelService';
import { roomService } from '../services/roomService';
import { bookingService } from '../services/bookingService';
import { Shield, Plus, Building2, Bed, CalendarCheck, DollarSign, X, Check, Trash2, Edit } from 'lucide-react';

export const AdminDashboard = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('HOTELS'); // 'HOTELS', 'BOOKINGS'
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
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
    country: 'USA',
    starRating: 4.8,
    amenities: 'WiFi, Swimming Pool, Spa, Fitness Center, Restaurant, Valet Parking',
    images: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
  });

  // New Room Form State
  const [roomForm, setRoomForm] = useState({
    hotelId: '',
    category: 'Deluxe Suite',
    pricePerNight: 240,
    capacity: 2,
    totalUnits: 10,
    amenities: 'King Bed, Ocean View, Smart TV, Mini Bar',
    images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const hotelsData = await hotelService.getAllHotels();
      setHotels(hotelsData);

      const bookingsData = await bookingService.getAllBookingsAdmin();
      setBookings(bookingsData);
    } catch (err) {
      // Fallback
      setHotels([
        { id: 1, name: "Grand Palace Hotel & Suites", city: "New York", country: "USA", starRating: 4.9, minPrice: 220 },
        { id: 2, name: "Azure Oceanfront Resort", city: "Miami", country: "USA", starRating: 4.8, minPrice: 280 }
      ]);
      setBookings([
        { id: 101, reservationNumber: "RES-202609-9X8K21", hotelName: "Grand Palace Hotel", roomCategory: "Deluxe Suite", checkInDate: "2026-10-15", checkOutDate: "2026-10-18", totalPrice: 840, status: "CONFIRMED" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
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

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-primary"><Shield size={13} /> Admin Console</span>
          </div>
          <h1 className="heading-serif" style={{ fontSize: '2.4rem', color: '#fff' }}>
            Property & Reservation Management
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} color="#818cf8" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Properties</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{hotels.length}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarCheck size={24} color="#34d399" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Bookings</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{bookings.length}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color="#fbbf24" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Confirmed Revenue</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6ee7b7' }}>${totalRevenue}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('HOTELS')}
          style={{
            background: activeTab === 'HOTELS' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            borderColor: activeTab === 'HOTELS' ? '#6366f1' : 'transparent',
            color: activeTab === 'HOTELS' ? '#fff' : 'var(--text-secondary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Hotel Properties ({hotels.length})
        </button>
        <button
          onClick={() => setActiveTab('BOOKINGS')}
          style={{
            background: activeTab === 'BOOKINGS' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            borderColor: activeTab === 'BOOKINGS' ? '#6366f1' : 'transparent',
            color: activeTab === 'BOOKINGS' ? '#fff' : 'var(--text-secondary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          All System Bookings ({bookings.length})
        </button>
      </div>

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
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                  {hotel.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {hotel.city}, {hotel.country} &bull; Rating: {hotel.starRating}★ &bull; Base Price: ${hotel.minPrice || 200}/night
                </p>
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

      {activeTab === 'BOOKINGS' && (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px' }}>Reservation #</th>
                <th style={{ padding: '16px' }}>Hotel / Room</th>
                <th style={{ padding: '16px' }}>Dates</th>
                <th style={{ padding: '16px' }}>Total Amount</th>
                <th style={{ padding: '16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '16px', fontWeight: 700, color: '#818cf8' }}>{b.reservationNumber}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{b.hotelName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{b.roomCategory}</div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                    {b.checkInDate} &rarr; {b.checkOutDate}
                  </td>
                  <td style={{ padding: '16px', fontWeight: 700, color: '#6ee7b7' }}>${b.totalPrice}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Hotel Modal */}
      {isAddHotelOpen && (
        <div className="modal-overlay" onClick={() => setIsAddHotelOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>Add New Hotel Property</h2>
              <button onClick={() => setIsAddHotelOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
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
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. San Francisco"
                    value={hotelForm.city}
                    onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    required
                    value={hotelForm.country}
                    onChange={(e) => setHotelForm({ ...hotelForm, country: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  required
                  placeholder="100 Coastal Boulevard"
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
              <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>
                Add Room for {selectedHotelForRoom?.name}
              </h2>
              <button onClick={() => setIsAddRoomOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
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
                  <label className="form-label">Price / Night ($)</label>
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
