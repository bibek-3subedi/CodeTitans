import React, { useState } from 'react';
import { findUserByEmailAndRole, upsertUser } from '../../lib/storage';

// Simple auth gate: login / signup for tenant or owner
function AuthGate({ role, onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    if (mode === 'login') {
      const existing = findUserByEmailAndRole(email, role);
      if (!existing || existing.password !== password) {
        setError('No account found with those details for this role.');
        return;
      }
      onAuthenticated(existing);
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      const existing = findUserByEmailAndRole(email, role);
      if (existing) {
        setError('An account already exists for this email and role. Try logging in.');
        return;
      }
      const newUser = upsertUser({
        id: `user-${Date.now()}`,
        role,
        name: name.trim(),
        email: email.trim(),
        password,
        kycVerified: false,
      });
      onAuthenticated(newUser);
    }
  };

  const roleLabel = role === 'tenant' ? 'Tenant' : 'Owner';

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">
        {mode === 'login' ? 'Log in' : 'Create account'} as {roleLabel}
      </h2>
      <p className="muted mb-4">
        Use a simple demo account to access the {roleLabel.toLowerCase()} side of RentEasy. Data stays
        in your browser only.
      </p>
      <div className="flex gap-2 mb-4">
        <button
          className={`btn btn-secondary btn-small ${mode === 'login' ? 'opacity-100' : 'opacity-70'}`}
          type="button"
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={`btn btn-secondary btn-small ${mode === 'signup' ? 'opacity-100' : 'opacity-70'}`}
          type="button"
          onClick={() => setMode('signup')}
        >
          Sign up
        </button>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div className="form-row">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="muted" style={{ color: '#b91c1c' }}>{error}</p>}
        <button type="submit" className="btn btn-primary">
          {mode === 'login' ? 'Continue' : 'Create account'}
        </button>
      </form>
    </div>
  );
}

export default AuthGate;

