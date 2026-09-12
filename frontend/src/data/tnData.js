/**
 * Central Tamil Nadu Data - Hotels, Districts, Destinations, and Suites
 * All images sourced from Unsplash - curated specifically for Tamil Nadu / South Indian culture & luxury hospitality
 */

// All 38 Tamil Nadu Districts
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

// Tamil Nadu Hotels with South Indian heritage images & room categories
export const TN_HOTELS = [
  {
    id: 1,
    name: 'The Grand Chola Palace',
    description: 'A majestic 5-star retreat in the heart of Chennai blending Chola dynasty architecture with ultra-modern luxury, offering panoramic Marina Beach views, award-winning South Indian dining, and an imperial wellness spa.',
    address: '100 Anna Salai, Guindy & Teynampet',
    city: 'Chennai',
    country: 'Tamil Nadu, India',
    starRating: 4.9,
    amenities: ['High-Speed WiFi', 'Rooftop Pool', 'Ayurvedic Spa', 'Fitness Centre', 'Valet Parking', 'Marina View Lounge', 'Chettinad Fine Dining'],
    images: [
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85'
    ],
    minPrice: 8500,
    rooms: [
      {
        id: 101,
        hotelId: 1,
        category: 'Chola Deluxe Room',
        pricePerNight: 8500,
        capacity: 2,
        totalUnits: 12,
        amenities: ['1 King Bed', 'City View', 'Smart 4K TV', 'Rain Shower', 'Free High-Speed WiFi', 'Filter Coffee Bar'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 102,
        hotelId: 1,
        category: 'Marina Panoramic Suite',
        pricePerNight: 12500,
        capacity: 3,
        totalUnits: 6,
        amenities: ['1 King Bed + Daybed', 'Marina Beach Horizon View', 'Deep Soaking Marble Tub', 'Lounge Access', 'Mini Bar'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 103,
        hotelId: 1,
        category: 'Imperial Dynasty Royal Suite',
        pricePerNight: 18500,
        capacity: 4,
        totalUnits: 2,
        amenities: ['2 Master Bedrooms', 'Private Terrace Jacuzzi', 'Dedicated Butler Service', 'Chettinad Private Dining'],
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },
  {
    id: 2,
    name: 'Kovai Nilgiris Resort & Spa',
    description: 'Nestled at the scenic gateway of the Nilgiri hills in Coimbatore, this eco-luxury resort offers breathtaking Western Ghats valley views, organic spice plantation trails, and authentic Kongu cuisine.',
    address: '32 Avinashi Road, Peelamedu',
    city: 'Coimbatore',
    country: 'Tamil Nadu, India',
    starRating: 4.8,
    amenities: ['WiFi', 'Infinity Pool', 'Ayurveda Centre', 'Organic Restaurant', 'Mountain View', 'Spice Garden Walk'],
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85'
    ],
    minPrice: 6200,
    rooms: [
      {
        id: 201,
        hotelId: 2,
        category: 'Kongu Valley Deluxe Room',
        pricePerNight: 6200,
        capacity: 2,
        totalUnits: 10,
        amenities: ['1 King Bed', 'Western Ghats View', 'Smart TV', 'Herbal Spa Toiletries', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 202,
        hotelId: 2,
        category: 'Nilgiri Foothills Cottage',
        pricePerNight: 9800,
        capacity: 3,
        totalUnits: 5,
        amenities: ['Private Garden Villa', 'Outdoor Rain Shower', 'Organic Breakfast Included', 'Fireplace'],
        images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },
  {
    id: 3,
    name: 'Meenakshi Heritage Grand',
    description: 'Located mere steps from the legendary Meenakshi Amman Temple in Madurai, offering temple-view suites, Dravidian-style carved courtyards, and authentic Chettinad royal thali banquets.',
    address: '15 West Perumal Maistry Street',
    city: 'Madurai',
    country: 'Tamil Nadu, India',
    starRating: 5.0,
    amenities: ['WiFi', 'Temple View Rooms', 'Chettinad Restaurant', 'Cultural Tours', 'Ayurvedic Spa', 'Temple Shuttle'],
    images: [
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85'
    ],
    minPrice: 7000,
    rooms: [
      {
        id: 301,
        hotelId: 3,
        category: 'Temple View Heritage Room',
        pricePerNight: 7000,
        capacity: 2,
        totalUnits: 14,
        amenities: ['Gopuram View Window', 'Rosewood Furnishings', 'Dravidian Brass Decor', 'Free Breakfast'],
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 302,
        hotelId: 3,
        category: 'Pandyan Royal Suite',
        pricePerNight: 11500,
        capacity: 3,
        totalUnits: 4,
        amenities: ['Private Temple View Balcony', 'Chettinad Thali Included', 'Separate Living Room', 'Marble Bath'],
        images: ['https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },
  {
    id: 4,
    name: 'Ooty Fern Hill Palace',
    description: 'A restored colonial-era palace in the misty Nilgiris surrounded by lush eucalyptus groves and rolling emerald tea gardens, featuring crackling fireplaces and British-heritage dining.',
    address: 'Fern Hill Road, Ooty',
    city: 'Nilgiris (Ooty)',
    country: 'Tamil Nadu, India',
    starRating: 4.9,
    amenities: ['WiFi', 'Fireplace Suites', 'Tea Garden Walk', 'Heritage Dining', 'Horseback Riding', 'Heated Rooms'],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85'
    ],
    minPrice: 9500,
    rooms: [
      {
        id: 401,
        hotelId: 4,
        category: 'Victorian Fireplace Suite',
        pricePerNight: 9500,
        capacity: 2,
        totalUnits: 8,
        amenities: ['Working Fireplace', 'Nilgiri Tea Garden View', 'Antique Teak Bed', 'High Tea Service'],
        images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 402,
        hotelId: 4,
        category: 'Governor’s Heritage Villa',
        pricePerNight: 16000,
        capacity: 4,
        totalUnits: 3,
        amenities: ['2 Bedrooms', 'Private Mountain Lawn', 'Personal Butler', 'Bonfire Arranged'],
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },
  {
    id: 5,
    name: 'Thanjavur Brihadeeswara Retreat',
    description: 'A culturally rich sanctuary adjacent to the UNESCO World Heritage Brihadeeswara Temple, offering Bharatanatyam recital courtyards, Chola bronze casting workshops, and serene Kaveri delta atmosphere.',
    address: '4 Nayak Road, Thanjavur',
    city: 'Thanjavur',
    country: 'Tamil Nadu, India',
    starRating: 4.7,
    amenities: ['WiFi', 'Cultural Performances', 'Heritage Pool', 'Temple Tours', 'Art Workshops', 'Ayurvedic Massage'],
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85'
    ],
    minPrice: 5500,
    rooms: [
      {
        id: 501,
        hotelId: 5,
        category: 'Chola Craft Deluxe Room',
        pricePerNight: 5500,
        capacity: 2,
        totalUnits: 12,
        amenities: ['Thanjavur Painting Art Decor', 'Courtyard View', 'Free Breakfast', 'Rain Shower'],
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 502,
        hotelId: 5,
        category: 'Nayak Heritage Suite',
        pricePerNight: 8500,
        capacity: 3,
        totalUnits: 4,
        amenities: ['Private Garden Veranda', 'Temple Architecture Views', 'Handcrafted Wood Furniture'],
        images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },
  {
    id: 6,
    name: 'Kanyakumari Horizon Resort',
    description: "Located right at India's southernmost tip where the Indian Ocean, Arabian Sea, and Bay of Bengal unite. Wake up to world-renowned sunrises, sea-facing cottages, and fresh coastal seafood.",
    address: 'Bypass Road, Beach Front',
    city: 'Kanyakumari',
    country: 'Tamil Nadu, India',
    starRating: 4.8,
    amenities: ['WiFi', 'Sea-View Cottages', 'Sunrise Observation Deck', 'Coastal Seafood Restaurant', 'Vivekananda Rock Boat Tours'],
    images: [
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85'
    ],
    minPrice: 6800,
    rooms: [
      {
        id: 601,
        hotelId: 6,
        category: 'Three-Seas Sunrise Cottage',
        pricePerNight: 6800,
        capacity: 2,
        totalUnits: 8,
        amenities: ['Unobstructed Sea View', 'Private Sunrise Balcony', 'Complimentary Coconut Drink', 'Free WiFi'],
        images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 602,
        hotelId: 6,
        category: 'Oceanfront Premium Villa',
        pricePerNight: 11000,
        capacity: 4,
        totalUnits: 3,
        amenities: ['Direct Beach Access', 'Panoramic Ocean Terrace', 'Outdoor Jacuzzi', 'Coastal Dinner Included'],
        images: ['https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },
  {
    id: 7,
    name: 'Salem Steel City Suites',
    description: 'A contemporary business and leisure hotel in Salem, offering sophisticated luxury suites, rooftop infinity restaurant, and swift connectivity to the misty Yercaud hill station.',
    address: '18 Sarada College Road, Salem',
    city: 'Salem',
    country: 'Tamil Nadu, India',
    starRating: 4.5,
    amenities: ['WiFi', 'Rooftop Restaurant', 'Business Centre', 'Pool', 'Gym', 'Yercaud Excursion Desk'],
    images: [
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85'
    ],
    minPrice: 4200,
    rooms: [
      {
        id: 701,
        hotelId: 7,
        category: 'Executive Business King',
        pricePerNight: 4200,
        capacity: 2,
        totalUnits: 15,
        amenities: ['1 King Bed', 'Ergonomic Workstation', 'High-Speed Fiber WiFi', 'Complimentary Breakfast'],
        images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 702,
        hotelId: 7,
        category: 'Yercaud Vista Club Suite',
        pricePerNight: 6500,
        capacity: 3,
        totalUnits: 6,
        amenities: ['Hill View Lounge', 'Mini Bar', 'Marble Bath', 'Priority Rooftop Dining'],
        images: ['https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },
  {
    id: 8,
    name: 'Trichy Rockfort River View',
    description: 'Perched along the serene banks of the sacred Kaveri River with commanding vistas of the prehistoric Rockfort Temple, delivering spiritual peace, riverside pavilions, and authentic Tamil delicacies.',
    address: '22 Rockfort Road, Tiruchirappalli',
    city: 'Tiruchirappalli',
    country: 'Tamil Nadu, India',
    starRating: 4.6,
    amenities: ['WiFi', 'River View Rooms', 'Temple Tours', 'Traditional Cuisine', 'Spa', 'Kaveri River Ghat Access'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85'
    ],
    minPrice: 4800,
    rooms: [
      {
        id: 801,
        hotelId: 8,
        category: 'Kaveri Riverfront Deluxe',
        pricePerNight: 4800,
        capacity: 2,
        totalUnits: 12,
        amenities: ['Riverfront Balcony', 'Rockfort Temple View', 'Smart TV', 'Herbal Bath Amenities'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 802,
        hotelId: 8,
        category: 'Rockfort Heritage Suite',
        pricePerNight: 7500,
        capacity: 3,
        totalUnits: 5,
        amenities: ['Panoramic River & Temple Vista', 'Hand-woven Silk Linen', 'Vegetarian Gourmet Breakfast'],
        images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },
  {
    id: 9,
    name: 'Tirunelveli Pearl City Resort',
    description: 'Celebrating Tirunelveli’s famed sweet traditions and southern hospitality, featuring fragrant tropical garden pools, Nellai Saiva feast dining, and easy excursions to the restorative Courtallam waterfalls.',
    address: '7 High Ground Road, Tirunelveli',
    city: 'Tirunelveli',
    country: 'Tamil Nadu, India',
    starRating: 4.5,
    amenities: ['WiFi', 'Garden Pool', 'Nellai Saiva Restaurant', 'Waterfall Tours', 'Ayurveda Centre', 'Halwa Tasting Station'],
    images: [
      'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85'
    ],
    minPrice: 3900,
    rooms: [
      {
        id: 901,
        hotelId: 9,
        category: 'Nellai Garden Room',
        pricePerNight: 3900,
        capacity: 2,
        totalUnits: 14,
        amenities: ['Tropical Garden View', 'King Bed', 'Complimentary Tirunelveli Halwa Box', 'WiFi'],
        images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 902,
        hotelId: 9,
        category: 'Courtallam Royal Suite',
        pricePerNight: 6200,
        capacity: 3,
        totalUnits: 4,
        amenities: ['Private Poolside Veranda', 'Ayurvedic Treatment Voucher Included', 'Spacious Living Area'],
        images: ['https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?auto=format&fit=crop&w=800&q=80']
      }
    ]
  },
  {
    id: 10,
    name: 'Vellore Fort Heritage Hotel',
    description: 'Flanked by the historic 16th-century stone ramparts of the Vellore Fort and Jalakanteswarar Temple, this boutique heritage property marries granite architectural legacy with contemporary royal comforts.',
    address: '10 Fort Road, Vellore',
    city: 'Vellore',
    country: 'Tamil Nadu, India',
    starRating: 4.4,
    amenities: ['WiFi', 'Fort View Rooms', 'Heritage Restaurant', 'Colonial Library', 'Garden Courtyard', 'Golden Temple Shuttle'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85'
    ],
    minPrice: 3500,
    rooms: [
      {
        id: 1001,
        hotelId: 10,
        category: 'Fort View Classic Room',
        pricePerNight: 3500,
        capacity: 2,
        totalUnits: 10,
        amenities: ['Granite Fort View', 'Queen Bed', 'Teak Wood Furniture', 'Smart TV', 'Free WiFi'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
      },
      {
        id: 1002,
        hotelId: 10,
        category: 'Imperial Fort Royal Suite',
        pricePerNight: 5800,
        capacity: 3,
        totalUnits: 3,
        amenities: ['Panoramic Fort Rampart Terrace', 'King Bed + Daybed', 'Traditional South Indian Breakfast'],
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80']
      }
    ]
  }
];

// Tamil Nadu Destinations for Home page
export const TN_DESTINATIONS = [
  {
    city: 'Chennai',
    region: 'Tamil Nadu',
    tagline: 'The Gateway & Coastal Metropolis',
    hotelCount: '14 Hotels',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=85'
  },
  {
    city: 'Madurai',
    region: 'Tamil Nadu',
    tagline: 'Temple City & Cultural Heart of the South',
    hotelCount: '9 Hotels',
    image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=800&q=85'
  },
  {
    city: 'Nilgiris (Ooty)',
    region: 'Tamil Nadu',
    tagline: 'Queen of Hill Stations & Tea Hills',
    hotelCount: '11 Hotels',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=85'
  },
  {
    city: 'Kanyakumari',
    region: 'Tamil Nadu',
    tagline: 'Where Three Oceans Meet at Land’s End',
    hotelCount: '7 Hotels',
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=85'
  },
  {
    city: 'Thanjavur',
    region: 'Tamil Nadu',
    tagline: 'The UNESCO Chola Heritage Capital',
    hotelCount: '6 Hotels',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=85'
  },
  {
    city: 'Coimbatore',
    region: 'Tamil Nadu',
    tagline: 'Western Ghats Gateway & Kongu Valley',
    hotelCount: '8 Hotels',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=85'
  },
  {
    city: 'Tiruchirappalli',
    region: 'Tamil Nadu',
    tagline: 'The Kaveri River & Ancient Rockfort City',
    hotelCount: '5 Hotels',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=85'
  },
  {
    city: 'Vellore',
    region: 'Tamil Nadu',
    tagline: 'The Imperial 16th-Century Fort City',
    hotelCount: '4 Hotels',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=85'
  }
];
