import axios from "axios";
import { supabase } from "../supabaseClient";

const API_BASE_URL = import.meta.env.VITE_URL;

const createRoomRequest = async (room) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log(room);

  const places = room.places.flatMap((place) =>
    Array(Number(place.count)).fill(place.description)
  );

  console.log(places);

  const response = await axios.post(
    `${API_BASE_URL}addNewRoom`,
    { ...room, places, userId: session.user.id },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  console.log(response);
};

export { createRoomRequest };
