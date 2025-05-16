// import { create } from 'zustand';
// import { persist, devtools } from 'zustand/middleware';
// import { supabase } from '../supabaseClient';

// const isDevelopment = import.meta.env.MODE === 'development';

// async function fetchUserDetails(userId) {
//   try {
//     const { data, error } = await supabase
//       .from('user_details')
//       .select('role, first_name, last_name, album_number')
//       .eq('user_id', userId)
//       .single();

//     if (error) throw error;
//     return data;
//   } catch (error) {
//     console.error("Failed to fetch user details:", error);
//     throw new Error("server.error");
//   }
// }

// const useAuthStore = create(
//   devtools(
//     persist(
//       (set, get) => ({
//         user: null,
//         session: null,
//         isLoading: false,
//         error: null,

//         setSession: async (session) => {
//           try {
//             set({ isLoading: true, error: null });
            
//             if (!session?.user?.id) {
//               set({ session: null, user: null });
//               return;
//             }

//             const userDetails = await fetchUserDetails(session.user.id);
            
//             set({ 
//               session,
//               user: {
//                 id: session.user.id,
//                 email: session.user.email,
//                 role: userDetails?.role || 'student',
//                 first_name: userDetails?.first_name || '',
//                 last_name: userDetails?.last_name || '',
//                 album_number: userDetails?.album_number || null,
//                 ...session.user.user_metadata
//               },
//               error: null
//             });
//           } catch (error) {
//             set({ error: error.message });
//           } finally {
//             set({ isLoading: false });
//           }
//         },

//         login: async (email, password) => {
//           try {
//             set({ isLoading: true, error: null });
//             const { data, error } = await supabase.auth.signInWithPassword({ 
//               email, 
//               password 
//             });

//             if (error) throw error;
//             if (!data?.session) throw new Error("server.noResponse");

//             const userDetails = await fetchUserDetails(data.session.user.id);
            
//             set({ 
//               session: data.session,
//               user: {
//                 id: data.session.user.id,
//                 email: data.session.user.email,
//                 role: userDetails?.role || 'student',
//                 first_name: userDetails?.first_name || '',
//                 last_name: userDetails?.last_name || '',
//                 album_number: userDetails?.album_number || null,
//                 ...data.session.user.user_metadata
//               },
//               error: null
//             });
            
//             return { success: true };
//           } catch (error) {
//             const errorMessage = error.message === 'Invalid login credentials' 
//               ? "errors.invalidCredentials" 
//               : error.message;
//             set({ error: errorMessage });
//             return { success: false, error: errorMessage };
//           } finally {
//             set({ isLoading: false });
//           }
//         },

//         logout: async () => {
//           try {
//             set({ isLoading: true });
//             const { error } = await supabase.auth.signOut();
//             if (error) throw error;
//             set({ user: null, session: null, error: null });
//           } catch (error) {
//             set({ error: "errors.logoutFailed" });
//             throw error;
//           } finally {
//             set({ isLoading: false });
//           }
//         },

//         checkSession: async () => {
//           try {
//             set({ isLoading: true });
//             const { data, error } = await supabase.auth.getSession();
            
//             if (error) throw error;
//             if (!data?.session) {
//               set({ user: null, session: null });
//               return null;
//             }

//             const userDetails = await fetchUserDetails(data.session.user.id);
            
//             set({
//               session: data.session,
//               user: {
//                 id: data.session.user.id,
//                 email: data.session.user.email,
//                 role: userDetails?.role || 'student',
//                 first_name: userDetails?.first_name || '',
//                 last_name: userDetails?.last_name || '',
//                 album_number: userDetails?.album_number || null,
//                 ...data.session.user.user_metadata
//               }
//             });
            
//             return data.session;
//           } catch (error) {
//             console.error("Session check failed:", error);
//             set({ user: null, session: null, error: "server.error" });
//             return null;
//           } finally {
//             set({ isLoading: false });
//           }
//         },

//         updateProfile: async (updatedData) => {
//           try {
//             set({ isLoading: true, error: null });
//             const { user } = get();
            
//             if (!user) throw new Error("errors.invalidCredentials");

//             // Валідація даних
//             if (!updatedData.first_name || !updatedData.last_name) {
//               throw new Error("errors.fillRequiredFields");
//             }

//             // Оновлення в user_details
//             const { error: detailsError } = await supabase
//               .from('user_details')
//               .update({
//                 first_name: updatedData.first_name,
//                 last_name: updatedData.last_name
//               })
//               .eq('user_id', user.id);

//             if (detailsError) throw detailsError;

//             // Оновлення в auth.users (метадані)
//             const { error: authError } = await supabase.auth.updateUser({
//               data: {
//                 first_name: updatedData.first_name,
//                 last_name: updatedData.last_name
//               }
//             });

//             if (authError) throw authError;

//             // Оновлення локального стану
//             set({
//               user: {
//                 ...user,
//                 first_name: updatedData.first_name,
//                 last_name: updatedData.last_name
//               }
//             });

//             return { success: true };
//           } catch (error) {
//             const errorMessage = error.message.includes('validation') 
//               ? error.message 
//               : "errors.updateFailed";
//             set({ error: errorMessage });
//             return { success: false, error: errorMessage };
//           } finally {
//             set({ isLoading: false });
//           }
//         },

//         updatePassword: async ({ currentPassword, newPassword }) => {
//           try {
//             set({ isLoading: true, error: null });
            
//             // Валідація пароля
//             if (newPassword.length < 8) {
//               throw new Error("password.requirements.length");
//             }

//             // Оновлення пароля
//             const { data, error } = await supabase.auth.updateUser({
//               password: newPassword
//             });

//             if (error) throw error;

//             return { success: true };
//           } catch (error) {
//             const errorMessage = error.message.includes('password') 
//               ? "password.requirements.length" 
//               : "errors.passwordChangeFailed";
//             set({ error: errorMessage });
//             return { success: false, error: errorMessage };
//           } finally {
//             set({ isLoading: false });
//           }
//         },

//         refreshUser: async () => {
//           try {
//             const { session } = get();
//             if (!session) return null;

//             const userDetails = await fetchUserDetails(session.user.id);
            
//             set({
//               user: {
//                 ...get().user,
//                 role: userDetails?.role || 'student',
//                 first_name: userDetails?.first_name || '',
//                 last_name: userDetails?.last_name || '',
//                 album_number: userDetails?.album_number || null
//               }
//             });
            
//             return userDetails;
//           } catch (error) {
//             console.error("Failed to refresh user:", error);
//             set({ error: "server.error" });
//             throw error;
//           }
//         },

//         resetError: () => set({ error: null }),

//         isAuthenticated: () => {
//           const { session } = get();
//           return !!session && session.expires_at * 1000 > Date.now();
//         }
//       }),
//       {
//         name: 'auth-storage',
//         partialize: (state) => ({
//           user: state.user ? {
//             id: state.user.id,
//             email: state.user.email,
//             role: state.user.role,
//             first_name: state.user.first_name,
//             last_name: state.user.last_name,
//             album_number: state.user.album_number
//           } : null
//         }),
//       }
//     ),
//     { 
//       name: 'AuthStore',
//       enabled: isDevelopment,
//     }
//   )
// );

// export default useAuthStore;