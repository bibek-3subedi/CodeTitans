import React, { useMemo, useState } from 'react';

function AdminDashboard({ listings, messages, setMessages }) {
  const [replyBody, setReplyBody] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const renterMessages = useMemo(
    () => messages.filter((m) => m.toRole === 'admin'),
    [messages]
  );

  const landlordMessages = useMemo(
    () => messages.filter((m) => m.toRole === 'landlord'),
    [messages]
  );

  const handleForwardToLandlord = (message) => {
    const listing = listings.find((l) => l.id === message.listingId);
    if (!listing) {
      alert('Listing not found.');
      return;
    }
    const newMsg = {
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      fromRole: 'admin',
      fromId: 'admin-1',
      toRole: 'landlord',
      toId: listing.landlordId,
      listingId: listing.id,
      body: `Renter message: ${message.body}`,
    };
    setMessages((prev) => [...prev, newMsg]);
    alert('Message forwarded to landlord.');
  };

  const handleReplyToRenter = (e) => {
    e.preventDefault();
    if (!selectedMessage || !replyBody.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      fromRole: 'admin',
      fromId: 'admin-1',
      toRole: 'renter',
      toId: selectedMessage.fromId,
      listingId: selectedMessage.listingId,
      body: replyBody.trim(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setReplyBody('');
    alert('Reply sent to renter.');
  };

  return (
    <div className="grid two-columns">
      <section className="card">
        <h2>All room listings</h2>
        {listings.length === 0 ? (
          <p>No listings in the system yet.</p>
        ) : (
          <ul className="listing-list">
            {listings.map((l) => (
              <li key={l.id} className="listing-item">
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
                  <p className="muted">Landlord ID: {l.landlordId}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Message center</h2>
        <p className="muted">
          Admin is the only bridge between renters and landlords. Messages flow{' '}
          <strong>Renter → Admin → Landlord</strong> and back.
        </p>
        <div className="tabs">
          <div className="tab-section">
            <h3>From renters</h3>
            {renterMessages.length === 0 ? (
              <p>No messages from renters.</p>
            ) : (
              <ul className="message-list selectable">
                {renterMessages.map((m) => (
                  <li
                    key={m.id}
                    className={
                      'message-item ' +
                      (selectedMessage && selectedMessage.id === m.id ? 'selected' : '')
                    }
                    onClick={() => setSelectedMessage(m)}
                  >
                    <div className="message-meta">
                      <span className="badge">RENTER</span>
                      <span className="muted">
                        {new Date(m.createdAt).toLocaleString()} (listing {m.listingId})
                      </span>
                    </div>
                    <p>{m.body}</p>
                    <button
                      type="button"
                      className="btn btn-secondary btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleForwardToLandlord(m);
                      }}
                    >
                      Forward to landlord
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="tab-section">
            <h3>For landlords</h3>
            {landlordMessages.length === 0 ? (
              <p>No messages sent to landlords yet.</p>
            ) : (
              <ul className="message-list">
                {landlordMessages.map((m) => (
                  <li key={m.id}>
                    <div className="message-meta">
                      <span className="badge">TO LANDLORD</span>
                      <span className="muted">
                        {new Date(m.createdAt).toLocaleString()} (listing {m.listingId})
                      </span>
                    </div>
                    <p>{m.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {selectedMessage && (
          <form className="form reply-form" onSubmit={handleReplyToRenter}>
            <h3>Reply to renter</h3>
            <p className="muted">
              Original message: <em>{selectedMessage.body}</em>
            </p>
            <textarea
              rows={4}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Type your reply to the renter here."
            />
            <button type="submit" className="btn btn-primary">
              Send reply
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;

