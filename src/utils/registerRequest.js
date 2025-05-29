import axios from "axios";

const URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const registerRequest = async (userData) => {
  try {
    const response = await axios.post(
      `${URL}registration`,
      {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        album_number: userData.studentId || "",
        password: userData.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      }
    );

    return response.data;

  } catch (error) {
    let errorKey = 'common.unknownError';
    let translationParams = {};

    // Обробка помилок від Supabase/API
    if (error.response?.data) {
      const errorData = error.response.data;

      // Для email, який вже існує
      if (errorData.error?.includes('already exists') || 
          errorData.error?.includes('already registered')) {
        errorKey = 'email.exists';
      }
      // Для невірного номеру альбому
      else if (errorData.error?.includes('album number') || 
               errorData.error?.includes('invalid album')) {
        errorKey = 'albumNumber.onlyDigits';
      }
      // Якщо бекенд повертає код помилки
      else if (errorData.error_code === 'EMAIL_EXISTS') {
        errorKey = 'email.exists';
      }
    }

    // Мережеві помилки
    if (error.code === 'ECONNABORTED') {
      errorKey = 'server.timeout';
    } else if (error.message.includes('Network Error')) {
      errorKey = 'server.noResponse';
    }

    console.error('Registration error:', {
      errorKey,
      originalError: error.response?.data || error.message
    });

    throw {
      translationKey: errorKey,
      translationParams,
      message: error.response?.data?.error || error.message
    };
  }
};

export default registerRequest;