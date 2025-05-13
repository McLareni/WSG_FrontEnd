// src/router/router.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import HomePage from '../pages/HomePage/HomePage';
import TeacherProfilePage from '../pages/TeacherProfilePage/TeacherProfilePage';
import TeacherPasswordPage from '../pages/TeacherPasswordPage/TeacherPasswordPage';
import TeacherEditPage from '../pages/TeacherEditPage/TeacherEditPage';
import StudentProfilePage from '../pages/StudentProfilePage/StudentProfilePage'
import StudentPasswordPage from '../pages/StudentPasswordPage/StudentPasswordPage'
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import PublicRoute from '../components/Auth/PublicRoute';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

const router = createBrowserRouter([
  {
    element: <Layout />, 
    children: [
      {
        path: '/',
        element: <Navigate to="/login" replace />,
      },
      {
        path: '/login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: '/home',
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/teacher/profile',
        element: (
          <ProtectedRoute>
            <TeacherProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/teacher/profile/password',
        element: (
          <ProtectedRoute>
            <TeacherPasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/teacher/profile/edit',
        element: (
          <ProtectedRoute>
            <TeacherEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/student/profile',
        element: (
          <ProtectedRoute>
            <StudentProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/student/profile/password',
        element: (
          <ProtectedRoute>
            <StudentPasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/student/profile/edit',
        element: (
          <ProtectedRoute>
            <StudentPasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;