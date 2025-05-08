import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import HomePage from '../pages/HomePage/HomePage';
import MyProfilePage from '../pages/MyProfilePage/MyProfilePage'

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
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/home',
        element: <HomePage />,
      },
      {
        path: '/profile',
        element: <MyProfilePage />,
      },
    ],
  },
]);

export default router;