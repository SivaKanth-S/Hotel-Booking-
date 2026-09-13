import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, CalendarCheck, Users, Shield } from 'lucide-react';

export const AdminNav = ({ activeTab }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '32px',
      borderBottom: '1px solid var(--border-glass)',
      paddingBottom: '14px',
      flexWrap: 'wrap'
    }}>
      <NavLink
        to="/admin"
        end
        style={({ isActive }) => ({
          background: isActive || activeTab === 'HOTELS' ? 'var(--primary-light)' : 'transparent',
          borderColor: isActive || activeTab === 'HOTELS' ? 'var(--primary)' : 'transparent',
          color: isActive || activeTab === 'HOTELS' ? 'var(--primary)' : 'var(--text-secondary)',
          padding: '10px 20px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        })}
      >
        <Building2 size={18} /> Hotel Properties
      </NavLink>

      <NavLink
        to="/admin/bookings"
        style={({ isActive }) => ({
          background: isActive || activeTab === 'BOOKINGS' ? 'var(--primary-light)' : 'transparent',
          borderColor: isActive || activeTab === 'BOOKINGS' ? 'var(--primary)' : 'transparent',
          color: isActive || activeTab === 'BOOKINGS' ? 'var(--primary)' : 'var(--text-secondary)',
          padding: '10px 20px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        })}
      >
        <CalendarCheck size={18} /> Hotel Bookings
      </NavLink>

      <NavLink
        to="/admin/customers"
        style={({ isActive }) => ({
          background: isActive || activeTab === 'CUSTOMERS' ? 'var(--primary-light)' : 'transparent',
          borderColor: isActive || activeTab === 'CUSTOMERS' ? 'var(--primary)' : 'transparent',
          color: isActive || activeTab === 'CUSTOMERS' ? 'var(--primary)' : 'var(--text-secondary)',
          padding: '10px 20px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        })}
      >
        <Users size={18} /> Customers & Guests
      </NavLink>
    </div>
  );
};
