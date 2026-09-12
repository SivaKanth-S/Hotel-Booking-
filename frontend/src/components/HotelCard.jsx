import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Waves, Coffee, Sparkles, ArrowRight } from 'lucide-react';

export const HotelCard = ({ hotel }) => {
  // Parse amenities if string or array
  const amenitiesList = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : (typeof hotel.amenities === 'string' ? hotel.amenities.split(',').map(s => s.trim()) : []);

  // Parse images
  const imagesList = Array.isArray(hotel.images)
    ? hotel.images
    : (typeof hotel.images === 'string' ? hotel.images.split(',').map(s => s.trim()) : []);

  const defaultImage = imagesList[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="glass-panel" style={{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Image Banner */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={defaultImage}
          alt={hotel.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(11, 15, 25, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontWeight: 700,
          fontSize: '0.85rem',
          color: '#fcd34d'
        }}>
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span>{hotel.starRating ? Number(hotel.starRating).toFixed(1) : '5.0'}</span>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(11, 15, 25, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.8rem',
          color: '#f9fafb'
        }}>
          <MapPin size={13} color="#818cf8" />
          <span>{hotel.city}, {hotel.country}</span>
        </div>
      </div>

      {/* Hotel Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px' }}>
          {hotel.name}
        </h3>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {hotel.description}
        </p>

        {/* Amenities Highlights */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
          {amenitiesList.slice(0, 3).map((item, idx) => (
            <span key={idx} style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              borderRadius: '4px',
              color: 'var(--text-secondary)'
            }}>
              {item}
            </span>
          ))}
          {amenitiesList.length > 3 && (
            <span style={{ fontSize: '0.75rem', padding: '3px 8px', color: 'var(--primary)', fontWeight: 600 }}>
              +{amenitiesList.length - 3} more
            </span>
          )}
        </div>

        {/* Footer info: Price & CTA */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-glass)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Starting from</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                ₹{(hotel.minPrice || hotel.startingPrice || 3999).toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ night</span>
            </div>
          </div>

          <Link to={`/hotels/${hotel.id}`} className="btn btn-primary btn-sm">
            <span>View Suites</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
