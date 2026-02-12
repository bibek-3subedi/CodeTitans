import React, { useState } from 'react';
import './App.css';
import { getStoredUser, setStoredUser, useBootstrapData, useListings, useMessages } from './lib/storage';
import LandlordDashboard from './features/landlord/LandlordDashboard';
import RenterDashboard from './features/renter/RenterDashboard';
import AdminDashboard from './features/admin/AdminDashboard';

// Root app: chooses role and wires shared data into role dashboards
function App() {
  useBootstrapData();

  const [currentUser, setCurrentUser] = useState(() => getStoredUser());

  const handleLoginAs = (role) => {
    // In a real app there would be authentication and real IDs.
    const userTemplates = {
      admin: { id: 'admin-1', name: 'Admin', role: 'admin' },
      renter: { id: 'renter-1', name: 'Sample Renter', role: 'renter' },
      landlord: { id: 'landlord-1', name: 'Sample Landlord', role: 'landlord' },
    };
    const user = userTemplates[role];
    setCurrentUser(user);
    setStoredUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStoredUser(null);
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Simple House Renter System</h1>
        <p className="app-subtitle">
          Role-based views for <strong>Admin</strong>, <strong>Renter</strong>, and{' '}
          <strong>Landlord</strong> (using localStorage).
        </p>
      </header>

      <main className="app-main">
        {!currentUser ? (
          <RoleChooser onLoginAs={handleLoginAs} />
        ) : (
          <DashboardLayout currentUser={currentUser} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

// Light-weight role selection component
function RoleChooser({ onLoginAs }) {
  return (
    <div className="card">
      <h2>Select role</h2>
      <p>Choose how you want to enter the system.</p>
      <div className="button-row">
        <button onClick={() => onLoginAs('admin')} className="btn btn-admin">
          Continue as Admin
        </button>
        <button onClick={() => onLoginAs('renter')} className="btn btn-renter">
          Continue as Renter
        </button>
        <button onClick={() => onLoginAs('landlord')} className="btn btn-landlord">
          Continue as Landlord
        </button>
      </div>
    </div>
  );
}

// Shared layout: fetch listings/messages once and pass into role dashboards
function DashboardLayout({ currentUser, onLogout }) {
  const [listings, setListings] = useListings();
  const [messages, setMessages] = useMessages();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <span className="badge">{currentUser.role.toUpperCase()}</span>
          <span className="user-name">Signed in as {currentUser.name}</span>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>

      {currentUser.role === 'landlord' && (
        <LandlordDashboard
          landlord={currentUser}
          listings={listings}
          setListings={setListings}
          messages={messages}
        />
      )}
      {currentUser.role === 'renter' && (
        <RenterDashboard renter={currentUser} listings={listings} setMessages={setMessages} />
      )}
      {currentUser.role === 'admin' && (
        <AdminDashboard listings={listings} messages={messages} setMessages={setMessages} />
      )}
    </div>
  );
}
export default App;
