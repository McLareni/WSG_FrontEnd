import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { supabase } from "../supabaseClient";
import * as api from "./api";
import { ERROR_MESSAGES } from "./constants";

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        session: null,
        error: null,

        // Новий метод для очищення помилок
        clearErrors: () => set({ error: null }),

        _handleError: (error) => {
          const message = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
          set({ error: message });
          return { success: false, error: message };
        },

        checkSession: async () => {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
              set({ user: null, session: null });
              return null;
            }

            // Якщо сесія вже є і не змінилася - не робимо зайвих запитів
            if (get().session?.access_token === session.access_token) {
              return session;
            }

            const userDetails = await api.fetchUserDetails(session.user.id);
            set({
              session,
              user: { ...session.user, ...userDetails },
              error: null,
            });

            return session;
          } catch (error) {
            set({ error: error.message });
            return null;
          }
        },

        login: async (email, password) => {
          try {
            set({ error: null });
            const { data, error: authError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (authError) throw authError;
            if (!data?.session) throw new Error(ERROR_MESSAGES.SERVER_ERROR);

            const userDetails = await api.fetchUserDetails(data.session.user.id);
            
            set({
              session: data.session,
              user: {
                id: data.session.user.id,
                email: data.session.user.email,
                ...userDetails,
                ...data.session.user.user_metadata,
              },
              error: null,
            });

            return { success: true };
          } catch (error) {
            return get()._handleError(error);
          }
        },
        
        logout: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ user: null, session: null, error: null });
          } catch (error) {
            return get()._handleError(error);
          }
        },

        updateProfile: async (updates) => {
          try {
            set({ error: null });
            const { user } = get();

            await api.updateUserProfile(user.id, updates);

            set({
              user: {
                ...user,
                ...updates,
              },
            });

            return { success: true };
          } catch (error) {
            return get()._handleError(error);
          }
        },

        isAuthenticated: () => {
          const { session } = get();
          return !!session && new Date(session.expires_at * 1000) > new Date();
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user
            ? {
                id: state.user.id,
                email: state.user.email,
                role: state.user.role,
                first_name: state.user.first_name,
                last_name: state.user.last_name,
                album_number: state.user.album_number,
              }
            : null,
        }),
      }
    )
  )
);

export default useAuthStore;