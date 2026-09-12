import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { HotelCard } from '../components/HotelCard';
import { hotelService } from '../services/hotelService';
import { TN_HOTELS, TN_DESTINATIONS } from '../data/tnData';
import { Sparkles, ShieldCheck, Clock, Award, ArrowRight, Star } from 'lucide-react';
import { handleImageError, DEFAULT_HOTEL_IMAGE } from '../utils/imageUtils';


export const Home = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await hotelService.getAllHotels();
        setFeaturedHotels(data.slice(0, 6));
      } catch (err) {
        setFeaturedHotels(TN_HOTELS.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '90px 0 70px 0',
        overflow: 'hidden'
      }}>
        {/* Glow ambient background */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(236, 72, 153, 0.08) 50%, transparent 80%)',
          filter: 'blur(60px)',
          zIndex: -1
        }} />

        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span className="badge badge-primary">
              <Sparkles size={13} />
              Tamil Nadu's Premier Luxury Hotel Booking Platform
            </span>
          </div>

          <h1 className="heading-serif gradient-text" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.15, marginBottom: '20px' }}>
            Discover Luxury Hotels<br />Across Tamil Nadu
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 12px auto',
            lineHeight: 1.6
          }}>
            From the coastal charm of Chennai to the misty hills of Ooty — explore handpicked 5-star stays across all 38 Tamil Nadu districts.
          </p>

          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            marginBottom: '40px'
          }}>
            🏛️ Heritage Palaces &nbsp;|&nbsp; 🌿 Hill Resorts &nbsp;|&nbsp; 🌊 Coastal Retreats &nbsp;|&nbsp; 🕌 Temple-Side Stays
          </p>

          {/* Hero Search Bar Component */}
          <div style={{ maxWidth: '980px', margin: '0 auto' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Trust & Feature Badges */}
      <section style={{ padding: '30px 0 60px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShieldCheck size={26} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-heading)', fontSize: '1rem', fontWeight: 700 }}>Verified TN Hotels</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Every property is verified across all 38 Tamil Nadu districts.</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Clock size={26} color="var(--success)" />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-heading)', fontSize: '1rem', fontWeight: 700 }}>Live Availability</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Real-time room availability across Tamil Nadu properties.</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Award size={26} color="var(--accent-gold)" />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-heading)', fontSize: '1rem', fontWeight: 700 }}>Curated Luxury</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Heritage palaces, hill resorts, beach retreats and more.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section style={{ padding: '40px 0 80px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '36px', flexWrap: 'wrap', gap: '16px'
          }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Handpicked Stays</span>
              <h2 className="heading-serif" style={{ fontSize: '2.2rem', color: 'var(--text-heading)' }}>
                Featured Tamil Nadu Hotels
              </h2>
            </div>
            <Link to="/hotels" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>View All Properties</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              Loading luxury properties...
            </div>
          ) : (
            <div className="grid-3">
              {featuredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tamil Nadu Destinations Section */}
      <section style={{ padding: '40px 0 80px 0', background: 'var(--bg-glass)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>Incredible Tamil Nadu</span>
            <h2 className="heading-serif" style={{ fontSize: '2.2rem', color: 'var(--text-heading)' }}>
              Explore Iconic Districts
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '8px auto 0' }}>
              From temple towns to misty hills, coastal cities to cultural capitals — Tamil Nadu offers every kind of luxury.
            </p>
          </div>

          <div className="grid-4">
            {TN_DESTINATIONS.map((dest, idx) => (
              <Link
                key={idx}
                to={`/hotels?city=${encodeURIComponent(dest.city)}`}
                className="glass-panel"
                style={{
                  position: 'relative', height: '280px', overflow: 'hidden',
                  borderRadius: 'var(--radius-md)', display: 'flex',
                  flexDirection: 'column', justifyContent: 'flex-end', padding: '20px'
                }}
              >
                <img
                  src={dest.image}
                  alt={dest.city}
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', objectFit: 'cover',
                    zIndex: 0, transition: 'transform 0.5s ease'
                  }}
                  onError={(e) => handleImageError(e, DEFAULT_HOTEL_IMAGE)}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.2) 60%, transparent 100%)',
                  zIndex: 1
                }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 600, textTransform: 'uppercase' }}>
                    {dest.region}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
                    {dest.city}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                    {dest.hotelCount}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section style={{ padding: '60px 0 80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-success" style={{ marginBottom: '8px' }}>Guest Reviews</span>
            <h2 className="heading-serif" style={{ fontSize: '2.2rem', color: 'var(--text-heading)' }}>
              Loved by Travelers Across Tamil Nadu
            </h2>
          </div>

          <div className="grid-3">
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                "The Grand Chola Palace in Chennai exceeded every expectation. The rooftop pool with Marina Beach views at sunset was absolutely magical!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>A</div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-heading)', fontWeight: 600 }}>Aravind Krishnamurthy</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Booking &bull; Chennai</span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                "Staying at Meenakshi Heritage Grand was a dream. Waking up to the temple gopuram view and having authentic Chettinad breakfast — unforgettable!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>P</div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-heading)', fontWeight: 600 }}>Priya Subramanian</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Booking &bull; Madurai</span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                "Ooty Fern Hill Palace is pure magic. The bonfire evenings, tea garden walks and Victorian architecture took us back in time. Booked again instantly!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>M</div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-heading)', fontWeight: 600 }}>Muthu Pandian</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Booking &bull; Nilgiris (Ooty)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
