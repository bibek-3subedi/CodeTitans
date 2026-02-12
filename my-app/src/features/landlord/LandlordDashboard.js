import React, { useMemo, useState } from 'react';

function LandlordDashboard({ landlord, listings, setListings, messages }) {
  const [form, setForm] = useState({
    title: '',
    color: '',
    width: '',
    price: '',
    location: '',
    description: '',
  });

  const landlordListings = useMemo(
    () => listings.filter((l) => l.landlordId === landlord.id),
    [listings, landlord.id]
  );

  const landlordMessagesFromAdmin = useMemo(
    () =>
      messages.filter(
        (m) =>
          (m.toRole === 'landlord' && m.toId === landlord.id) ||
          (m.fromRole === 'landlord' && m.fromId === landlord.id)
      ),
    [messages, landlord.id]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddListing = (e) => {
    e.preventDefault();
    if (!form.title || !form.color || !form.width || !form.price) return;
    const newListing = {
      id: `room-${Date.now()}`,
      landlordId: landlord.id,
      title: form.title,
      color: form.color,
      width: Number(form.width),
      price: Number(form.price),
      location: form.location || 'Unknown',
      description: form.description || '',
    };
    setListings((prev) => [...prev, newListing]);
    setForm({
      title: '',
      color: '',
      width: '',
      price: '',
      location: '',
      description: '',
    });
  };

  const handleDelete = (id) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="grid two-columns">
      <section className="card">
        <h2>Your room listings</h2>
        {landlordListings.length === 0 ? (
          <p>No rooms yet. Use the form to add one.</p>
        ) : (
          <ul className="listing-list">
            {landlordListings.map((l) => (
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
                </div>
                <button onClick={() => handleDelete(l.id)} className="btn btn-danger">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3>Add / update room</h3>
        <form className="form" onSubmit={handleAddListing}>
          <div className="form-row">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Color</label>
            <input name="color" value={form.color} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Width (m)</label>
            <input
              name="width"
              type="number"
              min="1"
              value={form.width}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Price / month</label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save listing
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Messages via Admin</h2>
        <p className="muted">
          You can only communicate with renters through the admin. There is <strong>no direct contact</strong>{' '}
          between landlord and renter.
        </p>
        {landlordMessagesFromAdmin.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <ul className="message-list">
            {landlordMessagesFromAdmin.map((m) => (
              <li key={m.id}>
                <div className="message-meta">
                  <span className="badge">{m.fromRole.toUpperCase()}</span>
                  <span className="muted">
                    {new Date(m.createdAt).toLocaleString()} (for listing {m.listingId})
                  </span>
                </div>
                <p>{m.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default LandlordDashboard;

