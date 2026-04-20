'use client';
import { URL } from './URL.js';

export async function apiFetch(url, options = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
  });

  if (res.status === 401) {
    const refreshRes = await fetch(`http://${URL}/api/token/refresh/`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!refreshRes.ok) {
      throw new Error('Session expired');
    }

    res = await fetch(url, {
      ...options,
      credentials: 'include',
      cache: 'no-store',
    });
  }
  return res;
}

export async function Account() {
  try {
    const res = await apiFetch(`http://${URL}/api/account/me/`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData));
    }
    const response = await res.json();
    if (response.user.username === '@Anonimo') {
      localStorage.setItem('logeed', 'false');
    } else {
      localStorage.setItem('logeed', 'true');
    }
    return response;
  } catch (error) {
    return null;
  }
}
