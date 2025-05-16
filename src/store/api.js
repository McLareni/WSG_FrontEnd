import { supabase } from '../supabaseClient';
import { ERROR_MESSAGES } from './constants';

export const fetchUserDetails = async (userId) => {
  const { data, error } = await supabase
    .from('user_details')
    .select('role, first_name, last_name, album_number')
    .eq('user_id', userId)
    .single();

  if (error) throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { error } = await supabase
    .from('user_details')
    .update(updates)
    .eq('user_id', userId);

  if (error) throw new Error(ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
};

export const updateAuthProfile = async (updates) => {
  const { error } = await supabase.auth.updateUser({
    data: updates
  });

  if (error) throw new Error(ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
};

export const updateUserPassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw new Error(ERROR_MESSAGES.PASSWORD_CHANGE_FAILED);
};