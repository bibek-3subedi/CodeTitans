import React, { useState } from 'react';
import { verifyKycWithAi } from '../../lib/aiVerification';
import { saveProfile, upsertUser } from '../../lib/storage';

// KYC form with simple "AI" verification and photo upload
function KycForm({ roleLabel, user, onVerified }) {
  const [fullName, setFullName] = useState(user?.name || '');
  const [idType, setIdType] = useState('Citizenship');
  const [idNumber, setIdNumber] = useState('');
  const [country, setCountry] = useState('Nepal');
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [consent, setConsent] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    const payload = {
      userId: user.id,
      role: user.role,
      fullName,
      idType,
      idNumber,
      country,
      photoDataUrl,
      consent: true,
    };
    const result = await verifyKycWithAi(payload);
    setAiResult(result);
    // For demo purposes, proceed regardless, but mark verified flag.
    const verifiedUser = {
      ...user,
      name: fullName,
      kycVerified: result.approved,
      kyc: {
        ...payload,
        verifiedAt: new Date().toISOString(),
      },
    };
    // Update user record with KYC verification status
    upsertUser(verifiedUser);
    
    // Also seed basic profile info for the role so dashboards can show it
    const roleKey = user.role === 'tenant' ? 'tenant' : 'owner';
    saveProfile(roleKey, {
      name: fullName,
      email: user.email || '',
      phone: '',
      bio: '',
      photoDataUrl: photoDataUrl || '',
    });
    onVerified(verifiedUser, result);
    setSubmitting(false);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Verify your identity</h2>
      <p className="muted mb-4">
        To keep RentEasy safe and trustworthy, we collect a few details and run a lightweight AI check
        before you continue as a {roleLabel}.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <label className="font-medium">Full name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
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
          <label className="font-medium">ID number</label>
          <input
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="e.g. 01-123456"
            required
          />
        </div>
        <div className="form-row">
          <label className="font-medium">Issuing country</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <div className="form-row">
          <label className="font-medium">KYC photo (mock upload)</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          <p className="muted text-xs">
            This image is stored only in your browser and used to visually identify your account in the
            demo.
          </p>
          {photoDataUrl && (
            <img
              src={photoDataUrl}
              alt="KYC preview"
              style={{ marginTop: 8, width: 80, height: 80, borderRadius: '999px', objectFit: 'cover' }}
            />
          )}
        </div>
        <div className="form-row">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            I confirm these details are correct and consent to this verification.
          </label>
        </div>
        {aiResult && (
          <div className="form-row">
            <p className="muted text-xs">
              <strong>AI summary:</strong> {aiResult.aiSummary}
            </p>
            {aiResult.issues.length > 0 && (
              <ul className="muted text-xs" style={{ paddingLeft: 16 }}>
                {aiResult.issues.map((issue) => (
                  <li key={issue}>- {issue}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!consent || submitting}
        >
          {submitting ? 'Verifying…' : 'Verify and continue'}
        </button>
      </form>
    </div>
  );
}

export default KycForm;

