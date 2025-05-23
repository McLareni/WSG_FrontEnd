import { Outlet } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';


const Layout = () => {
  return (
    <div className="app">
      <LanguageSwitcher />
      <main>
        <Outlet />  
      </main>
   
    </div>
  );
};

export default Layout;