import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hotelService } from '../services/hotelService';
import { HotelCard } from '../components/HotelCard';
import { TN_DISTRICTS, TN_HOTELS } from '../data/tnData';
import { Filter, Search, RotateCcw, Star, MapPin } from 'lucide-react';



export const HotelList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [district, setDistrict] = useState(searchParams.get('city') || '');
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 15000);
  const [minRating, setMinRating] = useState(Number(searchParams.get('minRating')) || 0);
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []
  );
  const [sortBy, setSortBy] = useState('recommended');

  const availableAmenities = ['WiFi', 'Swimming Pool', 'Spa', 'Fitness Centre', 'Restaurant', 'Valet Parking', 'Sea View', 'Mountain View', 'Temple Tours', 'Ayurveda'];

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = {};
      if (district) params.city = district;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.minRating = minRating;
      if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(',');
      const data = await hotelService.getAllHotels(params);
      setHotels(data);
    } catch (err) {
      setHotels(TN_HOTELS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [district, minRating, selectedAmenities]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setDistrict('');
    setMaxPrice(15000);
    setMinRating(0);
    setSelectedAmenities([]);
    setSearchParams({});
  };

  // Filter client-side
  const filteredHotels = hotels
    .filter((h) => {
      if (district && !h.city?.toLowerCase().includes(district.toLowerCase()) && !h.name?.toLowerCase().includes(district.toLowerCase())) {
        return false;
      }
      const price = h.minPrice || h.startingPrice || 5000;
      if (price > maxPrice) return false;
      if (minRating > 0 && (h.starRating || 5) < minRating) return false;
      if (selectedAmenities.length > 0) {
        const hAmenities = Array.isArray(h.amenities) ? h.amenities : (h.amenities ? h.amenities.split(',') : []);
        const hasAll = selectedAmenities.every((a) => hAmenities.some((ha) => ha.toLowerCase().includes(a.toLowerCase())));
        if (!hasAll) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = a.minPrice || 5000;
      const priceB = b.minPrice || 5000;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.starRating || 0) - (a.starRating || 0);
      return 0;
    });

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        {/* State banner */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'var(--primary-light)', border: '1px solid var(--border-glass-hover)',
          borderRadius: 'var(--radius-full)', padding: '6px 14px', marginBottom: '12px'
        }}>
          <MapPin size={14} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
            Tamil Nadu, India — All 38 Districts
          </span>
        </div>
        <h1 className="heading-serif" style={{ fontSize: '2.4rem', color: 'var(--text-heading)', marginBottom: '8px' }}>
          Explore Tamil Nadu Hotels
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Found <strong style={{ color: 'var(--text-heading)' }}>{filteredHotels.length}</strong> luxury {filteredHotels.length === 1 ? 'property' : 'properties'} in Tamil Nadu
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '32px',
        alignItems: 'start'
      }}>
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

          {/* District Filter */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} color="var(--primary)" /> Tamil Nadu District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="form-select"
              id="filter-district-select"
            >
              <option value="">-- All Districts --</option>
              {TN_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
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

          {/* Price Range (in INR) */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Max Price per Night</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>₹1,000</span>
              <span>₹15,000</span>
            </div>
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
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)'
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing <strong style={{ color: 'var(--text-heading)' }}>{filteredHotels.length}</strong> properties
              {district ? <> in <strong style={{ color: 'var(--primary)' }}>{district}</strong>, Tamil Nadu</> : ' across Tamil Nadu'}
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
              Loading Tamil Nadu hotels...
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Search size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-heading)', marginBottom: '8px' }}>
                No properties found in {district || 'Tamil Nadu'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Try a different district or reset the filters.
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
