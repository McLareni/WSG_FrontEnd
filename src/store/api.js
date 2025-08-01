import { supabase } from "../supabaseClient";

const API_BASE_URL = import.meta.env.VITE_URL;

const fetchWithAuth = async (endpoint, options = {}) => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("Unauthorized");
  }

  // Фікс для URL - прибираємо дублюючі слеші
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || "Server error");
    } catch {
      throw new Error(errorText || "Server error");
    }
  }

  return response.json();
};

export const fetchUserDetails = async (userId) => {
  return fetchWithAuth(`getuserdetails?user_id=${userId}`);
};

// *** ОНОВЛЕНА ФУНКЦІЯ updateUserProfile в api.js ***
export const updateUserProfile = async (userId, updates) => {
  return fetchWithAuth("UpdateUserInfo", { 
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      first_name: updates.first_name,
      last_name: updates.last_name,
      email: updates.email,
      ...(updates.album_number && {
        album_number: updates.album_number,
      }),
    }),
  });
};

export const changePassword = async (oldPassword, newPassword) => {
  return fetchWithAuth("ChangePassword", {
    method: "POST",
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });
};

export const fetchTeacherRooms = async (teacherId) => {
  try {
    const endpoint = `getAllUserRoom/${encodeURIComponent(teacherId)}`;
    const response = await fetchWithAuth(endpoint);
    
    if (response.rooms && response.rooms.length === 0) {
      return { success: true, data: [] };
    }
    
    return { success: true, data: response.rooms || [] };
  } catch (error) {
    console.error("Error fetching teacher rooms:", error);
    
    if (error.message?.includes("No rooms found")) {
      return { success: true, data: [] };
    }
    
    return { success: false, error: error.message };
  }
};

export const fetchRoomInfo = async (roomId) => {
  return fetchWithAuth(`getRoomInfo/${encodeURIComponent(roomId)}`);
};

export const fetchOpenHours = async (date, roomId, seatDescription) => {
  if (!date || !roomId || !seatDescription) {
    throw new Error("Missing required parameters");
  }

  const formattedDate = formatDateForAPI(date);
  const endpoint = `getOpenHour?desc=${encodeURIComponent(seatDescription)}&date=${encodeURIComponent(formattedDate)}&room_id=${roomId}`;
  
  try {
    const data = await fetchWithAuth(endpoint);
    return data.uniqueSortedTimes || [];
  } catch (error) {
    console.error("Error fetching open hours:", error);
    return [];
  }
};

const formatDateForAPI = (date) => {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');
};

export const reserveSeat = async (reservationData) => {
  return fetchWithAuth("reservation", {
    method: "POST",
    body: JSON.stringify({
      user_id: reservationData.user_id,
      room_id: reservationData.room_id,
      seat_desc: reservationData.seat_desc,
      start_time: reservationData.start_time,
      end_time: reservationData.end_time,
      date: reservationData.date,
    }),
  });
};

