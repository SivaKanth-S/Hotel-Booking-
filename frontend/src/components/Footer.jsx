import React from 'react';
import { Hotel, Heart, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{
      background: '#070a11',
      borderTop: '1px solid var(--border-glass)',
      padding: '60px 0 30px 0',
      color: 'var(--text-secondary)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Hotel size={20} color="#fff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>GRANDSTAY</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              The quintessential luxury hospitality platform. Concurrency-safe atomic reservations, curated suites, and unmatched travel experiences worldwide.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge badge-primary"><ShieldCheck size={12} /> Verified Stays</span>
              <span className="badge badge-gold"><Sparkles size={12} /> 5-Star Service</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ transition: '0.2s' }}>Home</Link></li>
              <li><Link to="/hotels" style={{ transition: '0.2s' }}>Explore All Hotels</Link></li>
              <li><Link to="/my-bookings" style={{ transition: '0.2s' }}>Manage Bookings</Link></li>
              <li><Link to="/login" style={{ transition: '0.2s' }}>Account Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Popular Destinations</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/hotels?city=New York">New York City, USA</Link></li>
              <li><Link to="/hotels?city=Miami">Miami South Beach, USA</Link></li>
              <li><Link to="/hotels?city=Paris">Paris, France</Link></li>
              <li><Link to="/hotels?city=Tokyo">Tokyo, Japan</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Security & Platform</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '12px' }}>
              Powered by Spring Boot 3 & React with stateless BCrypt + JWT security and isolated database transactions.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#6ee7b7' }}>
              <Zap size={15} /> <span>100% Real-time Availability Sync</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} GrandStay Hospitality Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with modern web standards and architectural excellence
          </div>
        </div>
      </div>
    </footer>
  );
};
