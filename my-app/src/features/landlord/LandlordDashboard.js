import React, { useMemo, useState } from 'react';
import { loadProfile, saveProfile } from '../../lib/storage';

function LandlordDashboard({ landlord, listings, setListings, messages }) {
  const [roomCount, setRoomCount] = useState(1);
  const [rooms, setRooms] = useState([
    {
      title: '',
      color: '',
      width: '',
      price: '',
      location: '',
      description: '',
      photoDataUrl: '',
    },
  ]);
  const [profile, setProfile] = useState(() => loadProfile('owner'));

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

  const handleRoomFieldChange = (index, field, value) => {
    setRooms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRoomPhotoUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRooms((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], photoDataUrl: reader.result };
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddListing = (e) => {
    e.preventDefault();
    const validRooms = rooms.filter(
      (r) => r.title && r.color && r.width && r.price
    );
    if (validRooms.length === 0) return;

    const newListings = validRooms.map((r, idx) => ({
      id: `room-${Date.now()}-${idx}`,
      landlordId: landlord.id,
      title: r.title,
      color: r.color,
      width: Number(r.width),
      price: Number(r.price),
      location: r.location || 'Unknown',
      description: r.description || '',
      photoDataUrl: r.photoDataUrl || '',
    }));

    setListings((prev) => [...prev, ...newListings]);
    setRooms(
      Array.from({ length: roomCount }, () => ({
        title: '',
        color: '',
        width: '',
        price: '',
        location: '',
        description: '',
        photoDataUrl: '',
      }))
    );
  };

  const handleDelete = (id) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      const next = { ...prev, [name]: value };
      saveProfile('owner', next);
      return next;
    });
  };

  return (
    <div className="grid two-columns">
      <section className="card">
        <h2>Your profile</h2>
        <p className="muted">
          This information is visible only to you and is used to personalize your experience as an
          owner.
        </p>
        <div className="form" style={{ marginTop: 8 }}>
          <div className="form-row">
            <label>Name</label>
            <input name="name" value={profile.name} onChange={handleProfileChange} />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input name="email" value={profile.email} onChange={handleProfileChange} />
          </div>
          <div className="form-row">
            <label>Phone</label>
            <input name="phone" value={profile.phone} onChange={handleProfileChange} />
          </div>
          <div className="form-row">
            <label>Short bio</label>
            <textarea
              name="bio"
              rows={2}
              value={profile.bio}
              onChange={handleProfileChange}
            />
          </div>
          <p className="muted text-xs">
            Total rooms/flats listed: <strong>{landlordListings.length}</strong>
          </p>
        </div>
      </section>

      <section className="card">
        <h2>Your room listings</h2>
        {landlordListings.length === 0 ? (
          <p>No rooms yet. Use the form to add one.</p>
        ) : (
          <ul className="listing-list">
            {landlordListings.map((l) => (
              <li key={l.id} className="listing-item">
                <div>
                  {l.photoDataUrl && (
                    <img
                      src={l.photoDataUrl}
                      alt={l.title}
                      style={{
                        width: '100%',
                        maxHeight: 160,
                        objectFit: 'cover',
                        borderRadius: 8,
                        marginBottom: 6,
                      }}
                    />
                  )}
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

      <section className="card">
        <h2>Add rooms / flats</h2>
        <p className="muted">
          Choose how many rooms or flats you want to add, then fill in the details and photo for each.
        </p>
        <form className="form" onSubmit={handleAddListing}>
          <div className="form-row">
            <label>Number of rooms / flats</label>
            <input
              type="number"
              min="1"
              value={roomCount}
              onChange={(e) => {
                const value = Math.max(1, Number(e.target.value) || 1);
                setRoomCount(value);
                setRooms((prev) => {
                  const next = [...prev];
                  if (value > next.length) {
                    while (next.length < value) {
                      next.push({
                        title: '',
                        color: '',
                        width: '',
                        price: '',
                        location: '',
                        description: '',
                        photoDataUrl: '',
                      });
                    }
                  } else if (value < next.length) {
                    next.length = value;
                  }
                  return next;
                });
              }}
            />
          </div>

          {rooms.map((room, index) => (
            <div key={index} className="card" style={{ marginTop: 8 }}>
              <p className="muted text-xs mb-2">Room #{index + 1}</p>
              <div className="form-row">
                <label>Title</label>
                <input
                  value={room.title}
                  onChange={(e) => handleRoomFieldChange(index, 'title', e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Color</label>
                <input
                  value={room.color}
                  onChange={(e) => handleRoomFieldChange(index, 'color', e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Width (m)</label>
                <input
                  type="number"
                  min="1"
                  value={room.width}
                  onChange={(e) => handleRoomFieldChange(index, 'width', e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Price / month</label>
                <input
                  type="number"
                  min="0"
                  value={room.price}
                  onChange={(e) => handleRoomFieldChange(index, 'price', e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Location</label>
                <input
                  value={room.location}
                  onChange={(e) => handleRoomFieldChange(index, 'location', e.target.value)}
                />
              </div>
              <div className="form-row">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={room.description}
                  onChange={(e) => handleRoomFieldChange(index, 'description', e.target.value)}
                />
              </div>
              <div className="form-row">
                <label>Room photo (mock upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleRoomPhotoUpload(index, e)}
                />
                {room.photoDataUrl && (
                  <img
                    src={room.photoDataUrl}
                    alt={`Room ${index + 1}`}
                    style={{
                      marginTop: 8,
                      width: '100%',
                      maxHeight: 140,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          <button type="submit" className="btn btn-primary">
            Save all rooms
          </button>
        </form>
      </section>
    </div>
  );
}

export default LandlordDashboard;

