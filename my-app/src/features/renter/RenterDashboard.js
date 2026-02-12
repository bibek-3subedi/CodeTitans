import React, { useMemo, useState } from 'react';

function RenterDashboard({ renter, listings, setMessages }) {
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    color: '',
  });
  const [selectedListing, setSelectedListing] = useState(null);
  const [messageBody, setMessageBody] = useState('');

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      if (filters.location && !l.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.color && l.color.toLowerCase() !== filters.color.toLowerCase()) {
        return false;
      }
      if (filters.minPrice && l.price < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && l.price > Number(filters.maxPrice)) {
        return false;
      }
      return true;
    });
  }, [filters, listings]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!selectedListing || !messageBody.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      fromRole: 'renter',
      fromId: renter.id,
      toRole: 'admin', // renter never talks directly to landlord
      toId: 'admin-1',
      listingId: selectedListing.id,
      body: messageBody.trim(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessageBody('');
    alert('Message sent to admin. They will contact the landlord for you.');
  };

  return (
    <div className="grid two-columns">
      <section className="card">
        <h2>Browse rooms</h2>
        <div className="filters">
          <div className="form-row inline">
            <label>Location</label>
            <input
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g. City Center"
            />
          </div>
          <div className="form-row inline">
            <label>Color</label>
            <input
              name="color"
              value={filters.color}
              onChange={handleFilterChange}
              placeholder="e.g. Blue"
            />
          </div>
          <div className="form-row inline">
            <label>Min price</label>
            <input
              name="minPrice"
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-row inline">
            <label>Max price</label>
            <input
              name="maxPrice"
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <p>No listings match your filters.</p>
        ) : (
          <ul className="listing-list selectable">
            {filteredListings.map((l) => (
              <li
                key={l.id}
                className={
                  'listing-item ' + (selectedListing && selectedListing.id === l.id ? 'selected' : '')
                }
                onClick={() => setSelectedListing(l)}
              >
                <div>
                  <h3>{l.title}</h3>
                  <p>
                    <strong>Color:</strong> {l.color} | <strong>Width:</strong> {l.width} m
                  </p>
                  <p>
                    <strong>Price:</strong> ${l.price} / month | <strong>Location:</strong>{' '}
                    {l.location}
                  </p>
                  {l.description && <p className="muted">{l.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Contact via Admin only</h2>
        <p className="muted">
          To protect privacy, renters never contact landlords directly. Your message goes to the
          admin, who will coordinate with the landlord.
        </p>
        {!selectedListing ? (
          <p>Select a room from the list to send a message.</p>
        ) : (
          <form className="form" onSubmit={handleSendMessage}>
            <div className="form-row">
              <label>Selected room</label>
              <input value={selectedListing.title} disabled />
            </div>
            <div className="form-row">
              <label>Your message to admin</label>
              <textarea
                rows={5}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="e.g. I am interested in this room, can you ask the landlord about availability?"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Send to Admin
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default RenterDashboard;

