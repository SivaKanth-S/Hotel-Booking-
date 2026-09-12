import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hotelService } from '../services/hotelService';
import { HotelCard } from '../components/HotelCard';
import { Filter, SlidersHorizontal, Search, RotateCcw, Star } from 'lucide-react';

export const HotelList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [minPrice, setMinPrice] = useState(Number(searchParams.get('minPrice')) || 50);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 1000);
  const [minRating, setMinRating] = useState(Number(searchParams.get('minRating')) || 0);
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []
  );
  const [sortBy, setSortBy] = useState('recommended');

  const availableAmenities = ['WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Valet Parking', 'Beach Access', 'Bar & Lounge'];

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = {};
      if (city) params.city = city;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.minRating = minRating;
      if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(',');

      const data = await hotelService.getAllHotels(params);
      setHotels(data);
    } catch (err) {
      // Fallback demo data
      setHotels([
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
        },
        {
          id: 4,
          name: "Sakura Imperial Hotel",
          description: "Zen garden tranquility meets ultra-modern luxury in central Tokyo with Mount Fuji vistas.",
          address: "1-1 Chiyoda",
          city: "Tokyo",
          country: "Japan",
          starRating: 4.9,
          amenities: ["WiFi", "Spa", "Onsen Hot Springs", "Tea Pavilion", "Fine Dining"],
          images: ["https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"],
          minPrice: 310
        },
        {
          id: 5,
          name: "The Kensington Royal Suites",
          description: "Historic boutique residence overlooking Hyde Park with private butler service.",
          address: "88 Kensington High St",
          city: "London",
          country: "UK",
          starRating: 4.7,
          amenities: ["WiFi", "Valet Parking", "Restaurant", "Cocktail Lounge", "Fitness Center"],
          images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"],
          minPrice: 260
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [city, minRating, selectedAmenities]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setCity('');
    setMinPrice(50);
    setMaxPrice(1000);
    setMinRating(0);
    setSelectedAmenities([]);
    setSearchParams({});
  };

  // Filter client-side
  const filteredHotels = hotels
    .filter((h) => {
      if (city && !h.city?.toLowerCase().includes(city.toLowerCase()) && !h.name?.toLowerCase().includes(city.toLowerCase())) {
        return false;
      }
      const price = h.minPrice || h.startingPrice || 200;
      if (price < minPrice || price > maxPrice) return false;
      if (minRating > 0 && (h.starRating || 5) < minRating) return false;
      if (selectedAmenities.length > 0) {
        const hAmenities = Array.isArray(h.amenities) ? h.amenities : (h.amenities ? h.amenities.split(',') : []);
        const hasAll = selectedAmenities.every((a) => hAmenities.some((ha) => ha.toLowerCase().includes(a.toLowerCase())));
        if (!hasAll) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = a.minPrice || 200;
      const priceB = b.minPrice || 200;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.starRating || 0) - (a.starRating || 0);
      return 0;
    });

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="heading-serif" style={{ fontSize: '2.4rem', color: 'var(--text-heading)', marginBottom: '8px' }}>
          Explore Luxury Accommodations
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Found {filteredHotels.length} luxury {filteredHotels.length === 1 ? 'property' : 'properties'} matching your criteria
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '32px',
        alignItems: 'start'
      }} className="hotel-list-layout">
        {/* Filter Sidebar */}
        <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)' }}>Filters</h3>
            </div>
            <button
              onClick={handleResetFilters}
              style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Destination Search */}
          <div className="form-group">
            <label className="form-label">City or Destination</label>
            <input
              type="text"
              placeholder="e.g. New York, Paris..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Star Rating Filter */}
          <div className="form-group">
            <label className="form-label">Minimum Star Rating</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'All Ratings', value: 0 },
                { label: '4.5★ & Above (Exceptional)', value: 4.5 },
                { label: '4.0★ & Above (Luxury)', value: 4.0 },
                { label: '3.5★ & Above (Comfort)', value: 3.5 }
              ].map((opt) => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="starRating"
                    checked={minRating === opt.value}
                    onChange={() => setMinRating(opt.value)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Max Price per Night</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>${maxPrice}</span>
            </div>
            <input
              type="range"
              min={100}
              max={1000}
              step={25}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          {/* Amenities Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Hotel Amenities</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {availableAmenities.map((amenity) => {
                const selected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      background: selected ? 'var(--primary-light)' : 'var(--bg-glass)',
                      borderColor: selected ? 'var(--primary)' : 'var(--border-glass)',
                      color: selected ? 'var(--primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div>
          {/* Top Sort Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-glass)'
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing <strong style={{ color: 'var(--text-heading)' }}>{filteredHotels.length}</strong> available stays
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
              Loading hotels...
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Search size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-heading)', marginBottom: '8px' }}>No properties found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Try adjusting your search criteria or resetting filters.
              </p>
              <button onClick={handleResetFilters} className="btn btn-secondary">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid-2">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
