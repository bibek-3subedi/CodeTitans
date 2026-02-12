import React, { useState } from 'react';

// Simple KYC form used for both tenant and owner
function KycForm({ roleLabel, onComplete }) {
  const [idType, setIdType] = useState('Citizenship');
  const [photoName, setPhotoName] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consent) return;
    const data = {
      idType,
      photoName: photoName || 'mock-photo.jpg',
      consent: true,
      verified: true,
      verifiedAt: new Date().toISOString(),
    };
    onComplete(data);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Verify your identity</h2>
      <p className="muted mb-4">
        To keep RentEasy safe and trustworthy, we do a simple KYC verification before you continue as a {roleLabel}.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <label className="font-medium">ID type</label>
          <select
            className="border rounded px-3 py-2"
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
          >
            <option value="Citizenship">Citizenship</option>
            <option value="National ID">National ID</option>
            <option value="Passport">Passport</option>
          </select>
        </div>
        <div className="form-row">
          <label className="font-medium">Photo (mock)</label>
          <input
            type="text"
            className="border rounded px-3 py-2"
            placeholder="e.g. selfie.png"
            value={photoName}
            onChange={(e) => setPhotoName(e.target.value)}
          />
          <p className="muted text-xs">
            No real upload happens in this demo. We just store this name in localStorage.
          </p>
        </div>
        <div className="form-row">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            I agree to the terms and allow my data to be used for verification.
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!consent}
        >
          Complete verification
        </button>
      </form>
    </div>
  );
}

export default KycForm;

