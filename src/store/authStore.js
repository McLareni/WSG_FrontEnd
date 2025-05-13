import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { supabase } from '../supabaseClient';

const isDevelopment = import.meta.env.MODE === 'development';

async function fetchUserDetails(accessToken) {
  const API_URL = import.meta.env.VITE_LOGIN_GETUSERDETAILS;
  if (!API_URL) throw new Error("API configuration error");

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) throw new Error("Failed to fetch user details");
    return await response.json();
  } catch (error) {
    console.error("User details fetch error:", error);
    throw error;
  }
}

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        session: null,
        isLoading: false,
        error: null,

        setSession: (session) => set({ session }),
        setUser: (user) => set({ user }),

        login: async (email, password) => {
          try {
            set({ isLoading: true, error: null });
            const { data, error } = await supabase.auth.signInWithPassword({ 
              email, 
              password 
            });

            if (error) throw error;

            const userDetails = await fetchUserDetails(data.session.access_token);
            
            set({ 
              user: userDetails,
              session: data.session,
              error: null
            });
            
            return { success: true, data };
          } catch (error) {
            set({ error: error.message });
            return { success: false, error: error.message };
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          try {
            set({ isLoading: true });
            await supabase.auth.signOut();
            set({ user: null, session: null, error: null });
          } catch (error) {
            set({ error: error.message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        checkSession: async () => {
          try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            
            if (!data.session || data.session.expires_at * 1000 < Date.now()) {
              set({ user: null, session: null });
              return null;
            }

            const userDetails = await fetchUserDetails(data.session.access_token);
            set({ session: data.session, user: userDetails });
            return data.session;
          } catch (error) {
            console.error("Session check failed:", error);
            set({ user: null, session: null });
            return null;
          }
        },

        isAuthenticated: () => {
          const { session } = get();
          return !!session && session.expires_at * 1000 > Date.now();
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user ? {
            first_name: state.user.first_name,
            last_name: state.user.last_name,
            role: state.user.role,
            email: state.user.email,
          } : null
        }),
      }
    ),
    { 
      name: 'AuthStore',
      enabled: isDevelopment,
    }
  )
);

export default useAuthStore;