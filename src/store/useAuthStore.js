import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { supabase } from "../supabaseClient";
import * as api from "./api";

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        session: null,
        error: null,
        isLoading: false,

        // Очищення помилок
        clearErrors: () => set({ error: null }),

        // Обробник помилок
        _handleError: (error) => {
          const message = error.message || 'errors.unknownError';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        },

        // Зміна пароля

        changePassword: async (oldPassword, newPassword) => {
  try {
    set({ isLoading: true, error: null });
    const result = await api.changePassword(oldPassword, newPassword);

    // Опціонально: викинути користувача після зміни пароля
    await supabase.auth.signOut();
    set({ session: null, user: null, isLoading: false });

    return { success: true, data: result };
  } catch (error) {
    return get()._handleError(error);
  }
},



        // Оновлення профілю користувача
        updateProfile: async (updates) => {
          try {
            set({ isLoading: true, error: null });
            const { session } = get();

            if (!session) {
              throw new Error('errors.unauthorized');
            }

            const response = await fetch(`${import.meta.env.VITE_URL}UpdateUserInfo`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                user_id: session.user.id,
                first_name: updates.first_name,
                last_name: updates.last_name,
                email: updates.email,
                ...(updates.album_number && { album_number: updates.album_number })
              })
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || 'errors.updateFailed');
            }

            const result = await response.json();

            // Оновлюємо дані користувача в стейті
            set({
              user: {
                ...get().user,
                first_name: updates.first_name,
                last_name: updates.last_name,
                email: updates.email,
                ...(updates.album_number && { album_number: updates.album_number })
              },
              isLoading: false,
              error: null
            });

            return { success: true, data: result };
          } catch (error) {
            return get()._handleError(error);
          }
        },

        // Інші методи залишаються без змін
        checkSession: async () => {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
              set({ user: null, session: null });
              return null;
            }

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
            if (!data?.session) throw new Error('Server error occurred');

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