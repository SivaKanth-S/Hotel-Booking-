import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { HotelCard } from '../components/HotelCard';
import { hotelService } from '../services/hotelService';
import { Sparkles, ShieldCheck, Clock, Award, ArrowRight, Star, Heart, Compass } from 'lucide-react';

export const Home = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await hotelService.getAllHotels();
        setFeaturedHotels(data.slice(0, 6));
      } catch (err) {
        // Fallback demo data
        setFeaturedHotels([
          {
            id: 1,
            name: "Grand Palace Hotel & Suites",
            description: "Luxury 5-star oasis in the heart of downtown with skyline views and premium spa.",
            address: "100 Central Avenue",
            city: "New York",
            country: "USA",
            starRating: 4.9,
            amenities: ["WiFi", "Swimming Pool", "Spa", "Fitness Center", "Valet Parking"],
            images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"],
            minPrice: 220
          },
          {
            id: 2,
            name: "Azure Oceanfront Resort",
            description: "Private beachside sanctuary offering infinity pools, cabanas, and fine dining.",
            address: "450 Ocean Drive",
            city: "Miami",
            country: "USA",
            starRating: 4.8,
            amenities: ["WiFi", "Beach Access", "Infinity Pool", "Bar & Lounge", "Spa"],
            images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"],
            minPrice: 280
          },
          {
            id: 3,
            name: "The Ritz Heritage Palace",
            description: "Timeless Parisian elegance with Michelin-starred cuisine and Seine river views.",
            address: "15 Place Vendome",
            city: "Paris",
            country: "France",
            starRating: 5.0,
            amenities: ["WiFi", "Fine Dining", "Concierge", "Spa", "Champagne Bar"],
            images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"],
            minPrice: 350
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const popularDestinations = [
    { city: "New York", country: "United States", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80", count: "12 Hotels" },
    { city: "Miami", country: "United States", image: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=600&q=80", count: "8 Hotels" },
    { city: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80", count: "15 Hotels" },
    { city: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80", count: "10 Hotels" }
  ];

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
              Next-Gen Luxury Hospitality Platform
            </span>
          </div>

          <h1 className="heading-serif gradient-text" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.15, marginBottom: '20px' }}>
            Escape to Extraordinary Luxury
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 40px auto',
            lineHeight: 1.6
          }}>
            Discover handpicked 5-star suites and beachfront retreats. Real-time availability checks and instant, atomic reservations.
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
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={26} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-heading)', fontSize: '1rem', fontWeight: 700 }}>Atomic Reservations</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Guaranteed zero double-bookings with transactional locks.</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={26} color="var(--success)" />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-heading)', fontSize: '1rem', fontWeight: 700 }}>Live Availability</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Check room vacancies per calendar date instantaneously.</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={26} color="var(--accent-gold)" />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-heading)', fontSize: '1rem', fontWeight: 700 }}>Curated Luxury</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Verified 5-star standards with premium hospitality perks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section style={{ padding: '40px 0 80px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '36px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Handpicked Stays</span>
              <h2 className="heading-serif" style={{ fontSize: '2.2rem', color: 'var(--text-heading)' }}>
                Featured Hotels & Resorts
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

      {/* Curated Destinations Section */}
      <section style={{ padding: '40px 0 80px 0', background: 'var(--bg-glass)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '8px' }}>Global Hotspots</span>
            <h2 className="heading-serif" style={{ fontSize: '2.2rem', color: 'var(--text-heading)' }}>
              Explore Iconic Destinations
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '8px auto 0' }}>
              From metropolitan skylines to sun-drenched coastlines.
            </p>
          </div>

          <div className="grid-4">
            {popularDestinations.map((dest, idx) => (
              <Link
                key={idx}
                to={`/hotels?city=${dest.city}`}
                className="glass-panel"
                style={{
                  position: 'relative',
                  height: '280px',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px'
                }}
              >
                <img
                  src={dest.image}
                  alt={dest.city}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.2) 60%, transparent 100%)',
                  zIndex: 1
                }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase' }}>
                    {dest.country}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
                    {dest.city}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                    {dest.count}
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
              Loved by Travelers Worldwide
            </h2>
          </div>

          <div className="grid-3">
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                "Booking the Presidential Suite at Grand Palace took seconds. Real-time availability was accurate, and the checkout was completely seamless."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#ffffff' }}>
                  S
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-heading)', fontWeight: 600 }}>Sophia Laurent</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Booking &bull; New York</span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                "The discount code WELCOME10 saved us over $100 on our anniversary trip to Miami. Received the confirmation code instantly!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#ffffff' }}>
                  M
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-heading)', fontWeight: 600 }}>Marcus Vance</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Booking &bull; Miami</span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                "High quality platform. Loved the simple 'My Bookings' interface that allowed me to view my reservation number and check-in dates clearly."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#ffffff' }}>
                  E
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-heading)', fontWeight: 600 }}>Elena Rostova</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Booking &bull; Paris</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
