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
  const normalizedEndpoint = endpoint.replace(/^\/+/, "");
  const url = `${API_BASE_URL}/${normalizedEndpoint}`;

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

export const fetchTeacherRooms = async (teacherNumericId) => {
  const { data: teacher, error: teacherError } = await supabase
    .from("user_details")
    .select("user_id")
    .eq("id", teacherNumericId)
    .single();

  if (teacherError || !teacher) {
    throw new Error("Teacher not found");
  }

  const { data: rooms, error: roomsError } = await supabase
    .from("Rooms")
    .select("*")
    .eq("teacher_id", teacher.user_id);

  if (roomsError) throw roomsError;

  return { rooms };
};

export const fetchRoomInfo = async (roomId) => {
  return fetchWithAuth(`getRoomInfo/${roomId}`);
};

export const fetchOpenHours = async (date, roomId) => {
  const formattedDate = date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');

  const endpoint = `getOpenHour?date="${formattedDate}"&room_id=${roomId}`;

  const data = await fetchWithAuth(endpoint);
  return data.uniqueSortedTimes;
};