import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import { AuthToastContainer } from './components/UI/ToastAuth/ToastAuth';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <AuthToastContainer />
    </>
  );
}

export default App;