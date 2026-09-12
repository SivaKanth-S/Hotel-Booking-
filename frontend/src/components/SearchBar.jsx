import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

// All 38 Tamil Nadu districts
export const TN_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris (Ooty)', 'Perambalur',
  'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga',
  'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli',
  'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai',
  'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

export const SearchBar = ({ initialCity = '', initialCheckIn = '', initialCheckOut = '', initialGuests = 2 }) => {
  const navigate = useNavigate();

  // Default dates: tomorrow and 3 days later
  const getDefaultDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const [district, setDistrict] = useState(initialCity);
  const [checkIn, setCheckIn] = useState(initialCheckIn || getDefaultDate(1));
  const [checkOut, setCheckOut] = useState(initialCheckOut || getDefaultDate(4));
  const [guests, setGuests] = useState(initialGuests);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (district) params.append('city', district);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="glass-panel" style={{
      padding: '20px',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
      background: 'var(--bg-card)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 120px',
        gap: '16px',
        alignItems: 'center'
      }}>
        {/* District Selector */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <MapPin size={14} color="var(--primary)" /> Tamil Nadu District
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="form-select"
            style={{ padding: '10px 14px' }}
            id="district-select"
          >
            <option value="">-- All Districts --</option>
            {TN_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Check-in Date */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <Calendar size={14} color="var(--primary)" /> Check-In
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="form-input"
            style={{ padding: '10px 14px' }}
          />
        </div>

        {/* Check-out Date */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <Calendar size={14} color="var(--primary)" /> Check-Out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="form-input"
            style={{ padding: '10px 14px' }}
          />
        </div>

        {/* Guests */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <Users size={14} color="var(--primary)" /> Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="form-select"
            style={{ padding: '10px 14px' }}
          >
            <option value={1}>1 Guest</option>
            <option value={2}>2 Guests</option>
            <option value={3}>3 Guests</option>
            <option value={4}>4 Guests</option>
            <option value={6}>6+ Guests (Family)</option>
          </select>
        </div>

        {/* Search Submit CTA */}
        <div style={{ alignSelf: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px' }}>
            <Search size={18} /> Search
          </button>
        </div>
      </div>
    </form>
  );
};
