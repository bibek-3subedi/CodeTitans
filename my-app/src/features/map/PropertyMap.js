import React from 'react';

// Simple map visualization for property locations (mock map for demo)
function PropertyMap({ listings, selectedListing, onSelectListing }) {
  // Mock coordinates for Kathmandu areas (simplified grid)
  const areaCoords = {
    'City Center': { x: 50, y: 30 },
    'Old Town': { x: 30, y: 50 },
    'New Road': { x: 45, y: 35 },
    'Thamel': { x: 40, y: 25 },
    'Koteshwor': { x: 60, y: 60 },
    'Baneshwor': { x: 55, y: 45 },
    'Unknown': { x: 50, y: 50 },
  };

  const getCoords = (location) => {
    const loc = (location || 'Unknown').toLowerCase();
    for (const [key, coords] of Object.entries(areaCoords)) {
      if (loc.includes(key.toLowerCase())) {
        return coords;
      }
    }
    return areaCoords.Unknown;
  };

  return (
    <div className="card">
      <h3>Property locations map</h3>
      <p className="muted text-xs">
        Click on markers to see property details. This is a simplified demo map.
      </p>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '300px',
          background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
          borderRadius: 8,
          border: '2px solid #0ea5e9',
          marginTop: 8,
        }}
      >
        {listings.map((listing) => {
          const coords = getCoords(listing.location);
          return (
            <div
              key={listing.id}
              onClick={() => onSelectListing && onSelectListing(listing)}
              style={{
                position: 'absolute',
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: selectedListing?.id === listing.id ? 10 : 1,
              }}
            >
              <div
                style={{
                  width: selectedListing?.id === listing.id ? 20 : 16,
                  height: selectedListing?.id === listing.id ? 20 : 16,
                  borderRadius: '50%',
                  background:
                    selectedListing?.id === listing.id
                      ? '#ef4444'
                      : listing.photoDataUrl
                      ? '#10b981'
                      : '#3b82f6',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s',
                }}
                title={`${listing.title} - Rs ${listing.price}/month`}
              />
              {selectedListing?.id === listing.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  {listing.title}
                </div>
              )}
            </div>
          );
        })}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            background: 'rgba(255,255,255,0.9)',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: '0.7rem',
          }}
        >
          🗺️ Kathmandu (demo map)
        </div>
      </div>
    </div>
  );
}

export default PropertyMap;
