import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { supabase } from '../supabaseClient';
import * as api from './api';
import * as validators from './validators';
import { ERROR_MESSAGES } from './constants';

const isDevelopment = import.meta.env.MODE === 'development';

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Початковий стан
        user: null,
        session: null,
        isLoading: false,
        error: null,

        // Допоміжний метод для обробки помилок
        _handleError: (error) => {
          const message = Object.values(ERROR_MESSAGES).includes(error.message)
            ? error.message
            : ERROR_MESSAGES.UNKNOWN_ERROR;
          set({ error: message });
          return { success: false, error: message };
        },

        // Перевірка поточної сесії
        checkSession: async () => {
          try {
            set({ isLoading: true });
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) throw error;
            
            if (session) {
              const userDetails = await api.fetchUserDetails(session.user.id);
              set({ 
                session,
                user: {
                  id: session.user.id,
                  email: session.user.email,
                  ...userDetails,
                  ...session.user.user_metadata
                },
                error: null
              });
            } else {
              set({ user: null, session: null, error: null });
            }
            
            return session;
          } catch (error) {
            set({ error: error.message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        // Вхід в систему
        login: async (email, password) => {
          try {
            set({ isLoading: true, error: null });
            const { data, error: authError } = await supabase.auth.signInWithPassword({
              email,
              password
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
                ...data.session.user.user_metadata
              },
              error: null
            });

            return { success: true };
          } catch (error) {
            return get()._handleError(error);
          } finally {
            set({ isLoading: false });
          }
        },

        // Вихід з системи
        logout: async () => {
          try {
            set({ isLoading: true });
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ user: null, session: null, error: null });
          } catch (error) {
            return get()._handleError(error);
          } finally {
            set({ isLoading: false });
          }
        },

        // Оновлення профілю
        updateProfile: async (updates) => {
          try {
            set({ isLoading: true, error: null });
            validators.validateProfileData(updates);

            await api.updateUserProfile(get().user.id, updates);
            await api.updateAuthProfile(updates);

            set({
              user: {
                ...get().user,
                ...updates
              }
            });

            return { success: true };
          } catch (error) {
            return get()._handleError(error);
          } finally {
            set({ isLoading: false });
          }
        },

        // Зміна пароля
        updatePassword: async ({ newPassword, confirmPassword }) => {
          try {
            set({ isLoading: true, error: null });
            validators.validatePassword(newPassword, confirmPassword);

            await api.updateUserPassword(newPassword);
            return { success: true };
          } catch (error) {
            return get()._handleError(error);
          } finally {
            set({ isLoading: false });
          }
        },

        // Оновлення даних користувача
        refreshUser: async () => {
          try {
            const { session } = get();
            if (!session) return null;

            const userDetails = await api.fetchUserDetails(session.user.id);
            set({
              user: {
                ...get().user,
                ...userDetails
              }
            });

            return userDetails;
          } catch (error) {
            return get()._handleError(error);
          }
        },

        // Скидання помилки
        resetError: () => set({ error: null }),

        // Перевірка чи авторизований користувач
        isAuthenticated: () => {
          const { session } = get();
          return !!session && session.expires_at * 1000 > Date.now();
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user ? {
            id: state.user.id,
            email: state.user.email,
            role: state.user.role,
            first_name: state.user.first_name,
            last_name: state.user.last_name,
            album_number: state.user.album_number
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