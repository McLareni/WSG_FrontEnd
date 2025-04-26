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
        album_number: userData.studentId,
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
    let errorMessage = "Registration failed";
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export default registerRequest;