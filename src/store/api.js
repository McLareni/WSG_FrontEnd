import { supabase } from '../supabaseClient';
import { ERROR_MESSAGES } from './constants';

const API_BASE_URL = import.meta.env.VITE_URL;

const fetchWithAuth = async (endpoint, options = {}) => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || ERROR_MESSAGES.SERVER_ERROR);
  }

  return response.json();
};

export const fetchUserDetails = async (userId) => {
  return fetchWithAuth(`getuserdetails?user_id=${userId}`);
};

export const updateUserProfile = async (userId, updates) => {
  return fetchWithAuth('updateprofile', {
    method: 'POST',
    body: JSON.stringify({ userId, updates })
  });
};