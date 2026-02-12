import React from 'react';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white/80">
      <div className="max-w-5xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-4 text-xs text-slate-600">
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500" />
            <span className="text-sm font-semibold text-slate-900">RentEasy</span>
          </div>
          <p>
            A trust-first rental platform prototype for Kathmandu. Preferences instead of searching,
            KYC instead of guesswork, and in-platform conversations instead of random calls.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="text-[11px] font-semibold text-slate-900 uppercase tracking-wide">
            For tenants
          </h4>
          <ul className="space-y-1">
            <li>Preference-based home matches</li>
            <li>Transparent reasons for every match</li>
            <li>Admin-mediated communication</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-[11px] font-semibold text-slate-900 uppercase tracking-wide">
            For owners
          </h4>
          <ul className="space-y-1">
            <li>Structured property listings</li>
            <li>Preferred tenant profiles</li>
            <li>Reviews & trust signals</li>
          </ul>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-5 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
        <p>© {year} RentEasy. Built as a demo for hackathons.</p>
        <p>
          No real payments or uploads — everything you see here runs in your browser using
          localStorage.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

