import { supabase } from '../supabaseClient';

const API_BASE_URL = import.meta.env.VITE_URL;

const fetchWithAuth = async (endpoint, options = {}) => {
  // Отримуємо актуальну сесію
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error('Unauthorized');
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
    throw new Error(errorData.error || 'Server error');
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

export const changePassword = async (oldPassword, newPassword) => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(`${import.meta.env.VITE_URL}ChangePassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'errors.passwordUpdateFailed');
  }

  return await response.json();
};
