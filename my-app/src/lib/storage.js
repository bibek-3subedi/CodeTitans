// Simple localStorage-backed data layer for the rental app
import { useEffect, useState } from 'react';

export const STORAGE_KEYS = {
  CURRENT_USER: 'rentmandu_current_user',
  LISTINGS: 'rentmandu_listings',
  MESSAGES: 'rentmandu_messages',
};

// Seed demo data on first load
export function useBootstrapData() {
  useEffect(() => {
    const listingsRaw = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    if (!listingsRaw) {
      const seedListings = [
        {
          id: 'room-1',
          landlordId: 'landlord-1',
          title: 'Sunny 1BHK near City Center',
          color: 'White',
          width: 18,
          price: 500,
          location: 'City Center',
          description: 'Bright, airy 1BHK with balcony.',
        },
        {
          id: 'room-2',
          landlordId: 'landlord-1',
          title: 'Cozy Studio',
          color: 'Blue',
          width: 12,
          price: 350,
          location: 'Old Town',
          description: 'Compact studio, ideal for students.',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(seedListings));
    }
    const messagesRaw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!messagesRaw) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
    }
  }, []);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
}

export function useListings() {
  const [listings, setListings] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  }, [listings]);

  return [listings, setListings];
}

export function useMessages() {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  return [messages, setMessages];
}

// KYC status per high-level role (tenant / owner)
export function loadKycStatus(roleKey) {
  try {
    const raw = localStorage.getItem(`renteasy_kyc_${roleKey}`);
    return raw ? JSON.parse(raw) : { verified: false };
  } catch {
    return { verified: false };
  }
}

export function saveKycStatus(roleKey, data) {
  localStorage.setItem(`renteasy_kyc_${roleKey}`, JSON.stringify(data));
}

// Tenant preferences stored per-tenant in localStorage
export function loadTenantPrefs(tenantId, createDefault) {
  try {
    const raw = localStorage.getItem(`rentmandu_tenant_prefs_${tenantId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore parse error and fall through to default
  }
  const defaults = createDefault ? createDefault() : {};
  localStorage.setItem(
    `rentmandu_tenant_prefs_${tenantId}`,
    JSON.stringify(defaults)
  );
  return defaults;
}

export function saveTenantPrefs(tenantId, prefs) {
  localStorage.setItem(
    `rentmandu_tenant_prefs_${tenantId}`,
    JSON.stringify(prefs)
  );
}

