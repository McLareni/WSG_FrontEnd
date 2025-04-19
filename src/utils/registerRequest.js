import axios from "axios";

const URL = import.meta.env.VITE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const registerRequest = async (userData) => {
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

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  console.log(data);
};

export default registerRequest;
