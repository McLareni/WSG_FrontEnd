import axios from "axios";

const URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const registerRequest = async (userData) => {
  // Log registration attempt
  console.log('Registration attempt:', { 
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    isTeacher: !userData.studentId
  });

  try {
    const response = await axios.post(
      `${URL}registration`,
      {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        album_number: userData.studentId || "", // Ensure empty string if undefined
        password: userData.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      }
    );

    console.log('Registration successful:', { 
      email: userData.email,
      userId: response.data?.user_id 
    });
    return response.data;

  } catch (error) {
    let errorMessage = "Registration failed";
    let errorDetails = {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method
      }
    };

    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Registration error:', { 
      message: errorMessage,
      ...errorDetails,
      inputData: {
        email: userData.email,
        firstName: userData.firstName
      }
    });
    
    throw new Error(errorMessage);
  }
};

export default registerRequest;