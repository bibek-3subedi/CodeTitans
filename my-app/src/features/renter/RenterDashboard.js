import React, { useMemo, useState } from 'react';
import { createDefaultTenantPrefs } from '../../lib/models';
import { loadTenantPrefs, saveTenantPrefs } from '../../lib/storage';
import { sortListingsByMatch } from '../matching/matchEngine';

function RenterDashboard({ renter, listings, setMessages }) {
  const [prefs, setPrefs] = useState(() =>
    loadTenantPrefs(renter.id, createDefaultTenantPrefs)
  );
  const [selectedListing, setSelectedListing] = useState(null);
  const [messageBody, setMessageBody] = useState('');

  const matches = useMemo(
    () => sortListingsByMatch(prefs, listings),
    [prefs, listings]
  );

  const handlePrefsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrefs((prev) => {
      let next = { ...prev };
      if (type === 'checkbox') {
        next[name] = checked;
      } else if (name === 'preferredAreas') {
        next.preferredAreas = value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (
        name === 'budgetMin' ||
        name === 'budgetMax' ||
        name === 'rooms' ||
        name === 'familySize' ||
        name === 'maxCommuteKm'
      ) {
        next[name] = Number(value || 0);
      } else {
        next[name] = value;
      }
      saveTenantPrefs(renter.id, next);
      return next;
    });
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
        <h2>Your preferences</h2>
        <p className="muted">
          Define what you care about once. The system then ranks houses based on your preferences.
        </p>
        <div className="filters">
          <div className="form-row inline">
            <label>Budget min (Rs)</label>
            <input
              type="number"
              name="budgetMin"
              value={prefs.budgetMin}
              min="0"
              onChange={handlePrefsChange}
            />
          </div>
          <div className="form-row inline">
            <label>Budget max (Rs)</label>
            <input
              type="number"
              name="budgetMax"
              value={prefs.budgetMax}
              min="0"
              onChange={handlePrefsChange}
            />
          </div>
          <div className="form-row inline">
            <label>Preferred areas (comma separated)</label>
            <input
              name="preferredAreas"
              value={prefs.preferredAreas.join(', ')}
              onChange={handlePrefsChange}
              placeholder="e.g. New Road, Koteshwor"
            />
          </div>
          <div className="form-row inline">
            <label>Rooms needed</label>
            <input
              type="number"
              name="rooms"
              value={prefs.rooms}
              min="1"
              onChange={handlePrefsChange}
            />
          </div>
          <div className="form-row inline">
            <label>Lifestyle</label>
            <select name="lifestyle" value={prefs.lifestyle} onChange={handlePrefsChange}>
              <option value="any">Any</option>
              <option value="quiet">Quiet</option>
              <option value="social">Social</option>
            </select>
          </div>
          <div className="form-row inline">
            <label>
              <input
                type="checkbox"
                name="wifiRequired"
                checked={prefs.wifiRequired}
                onChange={handlePrefsChange}
              />{' '}
              WiFi required
            </label>
          </div>
        </div>

        <h3 style={{ marginTop: 16 }}>Matched houses</h3>
        {matches.length === 0 ? (
          <p>No matches yet. Try widening your budget or areas.</p>
        ) : (
          <ul className="listing-list selectable">
            {matches.map(({ listing, score, reasons }) => (
              <li
                key={listing.id}
                className={
                  'listing-item ' +
                  (selectedListing && selectedListing.id === listing.id ? 'selected' : '')
                }
                onClick={() => setSelectedListing(listing)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{listing.title}</h3>
                    <span className="badge">Score {score}</span>
                  </div>
                  <p>
                    <strong>Price:</strong> Rs {listing.price} / month | <strong>Location:</strong>{' '}
                    {listing.location}
                  </p>
                  <p>
                    <strong>Color:</strong> {listing.color} | <strong>Width:</strong> {listing.width} m
                  </p>
                  {listing.description && <p className="muted">{listing.description}</p>}
                  <ul className="muted" style={{ marginTop: 4, paddingLeft: 16, fontSize: '0.8rem' }}>
                    {reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
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

