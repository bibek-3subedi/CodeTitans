import React, { useState } from 'react';
import './App.css';
import {
  setStoredUser,
  useBootstrapData,
  useListings,
  useMessages,
  loadKycStatus,
  saveKycStatus,
} from './lib/storage';
import LandlordDashboard from './features/landlord/LandlordDashboard';
import RenterDashboard from './features/renter/RenterDashboard';
import AdminDashboard from './features/admin/AdminDashboard';
import KycForm from './features/auth/KycForm';
import Navbar from './features/landing/Navbar';
import Footer from './features/landing/Footer';

// Root app: chooses role and wires shared data into role dashboards
function App() {
  useBootstrapData();

  // Always start at the landing page; user chooses Tenant/Owner each time.
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingRole, setPendingRole] = useState(null); // 'tenant' | 'owner'
  const [kyc, setKyc] = useState(() => ({
    tenant: loadKycStatus('tenant'),
    owner: loadKycStatus('owner'),
  }));

  const loginAsInternalRole = (role) => {
    const userTemplates = {
      admin: { id: 'admin-1', name: 'Platform Admin', role: 'admin' },
      renter: { id: 'renter-1', name: 'Tenant User', role: 'renter' },
      landlord: { id: 'landlord-1', name: 'Owner User', role: 'landlord' },
    };
    const user = userTemplates[role];
    setCurrentUser(user);
    setStoredUser(user);
  };

  const handleSelectTenant = () => {
    if (kyc.tenant.verified) {
      loginAsInternalRole('renter');
    } else {
      setPendingRole('tenant');
    }
  };

  const handleSelectOwner = () => {
    if (kyc.owner.verified) {
      loginAsInternalRole('landlord');
    } else {
      setPendingRole('owner');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStoredUser(null);
  };

  return (
    <div className="app-root">
      <main className="app-main">
        {!currentUser && !pendingRole && (
          <>
            <Navbar onTenantClick={handleSelectTenant} onOwnerClick={handleSelectOwner} />
            <Landing onTenantClick={handleSelectTenant} onOwnerClick={handleSelectOwner} />
            <Footer />
          </>
        )}

        {!currentUser && pendingRole === 'tenant' && (
          <KycForm
            roleLabel="tenant"
            onComplete={(data) => {
              const next = { ...kyc, tenant: data };
              setKyc(next);
              saveKycStatus('tenant', data);
              setPendingRole(null);
              loginAsInternalRole('renter');
            }}
          />
        )}

        {!currentUser && pendingRole === 'owner' && (
          <KycForm
            roleLabel="owner"
            onComplete={(data) => {
              const next = { ...kyc, owner: data };
              setKyc(next);
              saveKycStatus('owner', data);
              setPendingRole(null);
              loginAsInternalRole('landlord');
            }}
          />
        )}

        {currentUser && (
          <DashboardLayout currentUser={currentUser} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

// Landing page: problem + solution with role entry (inspired by home-harmony-hub landing)
function Landing({ onTenantClick, onOwnerClick }) {
  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section className="relative pt-16 pb-16 md:pt-20 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 -z-10" />
        <div className="absolute top-10 right-0 w-80 h-80 bg-blue-200/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-sm font-medium text-blue-700 border border-blue-100 mb-5">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            Trust-first rental platform for Kathmandu
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Find your next home,{" "}
            <span className="text-blue-600">without agents or scams.</span>
          </h2>

          <p className="mt-5 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            RentEasy matches verified tenants and owners using structured preferences and platform-controlled
            communication. No random calls, no broker fees, just clear matches that explain why a home fits you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={onTenantClick}
              className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-700 transition"
            >
              I&apos;m a Tenant
            </button>
            <button
              onClick={onOwnerClick}
              className="px-8 py-3 rounded-full border border-blue-200 text-blue-700 font-semibold text-sm bg-white/80 hover:bg-blue-50 transition"
            >
              I&apos;m an Owner
            </button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              KYC-verified users only
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              Preference-based matching, not manual search
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              No direct tenant–owner contact
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">What&apos;s broken today</h3>
          <p className="text-slate-600 text-sm mb-3">
            Renting in Kathmandu is messy: scattered Facebook posts, fake listings, middlemen, and zero
            transparency about who you&apos;re dealing with.
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Unstructured listings with missing details.</li>
            <li>• Time wasted on calls for homes that don&apos;t fit.</li>
            <li>• No identity verification, easy for scams.</li>
            <li>• Agents taking cuts without adding trust.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">How RentEasy fixes it</h3>
          <p className="text-slate-600 text-sm mb-3">
            We turn rentals into a structured matching problem instead of a blind search problem.
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Tenants define preferences once; the system finds matches.</li>
            <li>• Owners list structured details and their ideal tenant profile.</li>
            <li>• Both sides complete KYC and get a verified badge.</li>
            <li>• All chat flows through the platform, monitored for safe behavior.</li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
          How RentEasy works in 3 steps
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="card">
            <p className="text-xs font-semibold text-blue-600 mb-1">Step 1</p>
            <h4 className="font-semibold mb-1">Verify & onboard</h4>
            <p className="text-slate-600">
              Tenants and owners complete a quick KYC and fill structured profiles: preferences for tenants,
              property details for owners.
            </p>
          </div>
          <div className="card">
            <p className="text-xs font-semibold text-blue-600 mb-1">Step 2</p>
            <h4 className="font-semibold mb-1">Smart matching</h4>
            <p className="text-slate-600">
              The system scores each property against tenant preferences and shows a ranked list with clear
              reasons for every match.
            </p>
          </div>
          <div className="card">
            <p className="text-xs font-semibold text-blue-600 mb-1">Step 3</p>
            <h4 className="font-semibold mb-1">Safe communication</h4>
            <p className="text-slate-600">
              Tenants talk to owners only through the platform admin. Contact details are filtered so nobody
              can bypass the platform.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
          What early users are saying
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="card">
            <p className="text-xs font-semibold text-emerald-600 mb-1">Tenant · Lalitpur</p>
            <p className="text-slate-700">
              “Instead of endless scrolling, I got 4 matches that actually fit my budget and lifestyle.
              The explanation for each match felt like talking to a local friend.”
            </p>
          </div>
          <div className="card">
            <p className="text-xs font-semibold text-emerald-600 mb-1">Owner · Baneshwor</p>
            <p className="text-slate-700">
              “KYC and reviews make it much easier to trust tenants. I can set clear preferences and let
              the platform filter who reaches me.”
            </p>
          </div>
          <div className="card">
            <p className="text-xs font-semibold text-emerald-600 mb-1">Student · New Road</p>
            <p className="text-slate-700">
              “The admin in the middle gave me peace of mind. No random numbers, no pressure — just a
              clean process from interest to booking.”
            </p>
          </div>
        </div>
      </section>

      {/* Future roadmap / plans */}
      <section id="trust" className="max-w-5xl mx-auto px-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-3 text-center">
          Where RentEasy is heading next
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="card">
            <h4 className="font-semibold mb-1">Smarter matching</h4>
            <p className="text-slate-600">
              Deeper preference signals, commute-aware scoring, and smarter explanations so you always
              know why a place is recommended.
            </p>
          </div>
          <div className="card">
            <h4 className="font-semibold mb-1">Safer transactions</h4>
            <p className="text-slate-600">
              Escrow-style booking flow, verified payments, and stronger anti-scam checks to protect
              both tenants and owners.
            </p>
          </div>
          <div className="card">
            <h4 className="font-semibold mb-1">City-by-city rollout</h4>
            <p className="text-slate-600">
              Starting in Kathmandu, then expanding across major Nepali cities with local rules baked
              into the matching logic.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & demo note */}
      <section id="demo" className="max-w-5xl mx-auto px-4 pb-10">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Built for trust, demo-ready</h3>
          <p className="text-slate-600 text-sm mb-2">
            This RentEasy preview runs entirely in your browser using localStorage. It simulates KYC, preference
            matching, safe messaging, and reviews without any real payments or uploads.
          </p>
          <p className="text-slate-500 text-xs">
            Use the buttons above to enter as a tenant or owner and experience the flow end to end.
          </p>
        </div>
      </section>
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
