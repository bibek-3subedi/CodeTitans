import React from 'react';

function Navbar({ onTenantClick, onOwnerClick }) {
  return (
    <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500" />
          <div>
            <div className="text-sm font-semibold text-slate-900">RentEasy</div>
            <div className="text-[11px] text-slate-500">Trust-first rentals</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-xs text-slate-600">
          <a href="#how-it-works" className="hover:text-slate-900">
            How it works
          </a>
          <a href="#trust" className="hover:text-slate-900">
            Trust & safety
          </a>
          <a href="#demo" className="hover:text-slate-900">
            Demo info
          </a>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onTenantClick}
            className="hidden sm:inline-flex px-4 py-1.5 rounded-full text-xs font-semibold border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 transition"
          >
            Tenant
          </button>
          <button
            onClick={onOwnerClick}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition"
          >
            Owner
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

