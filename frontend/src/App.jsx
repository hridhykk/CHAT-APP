
import {useEffect} from 'react'
import { Routes,Navigate,Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';

import Navbar from './components/Navbar.jsx';
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage';
import SignUppage from './pages/SignUppage';
import Settingspage from './pages/Settingspage';
import Profilepage from './pages/Profilepage';
import { authStore } from './store/authstore.jsx';
import { useThemeStore } from "./store/themeStore.jsx";


function App() {
  const { authUser, checkAuth, isCheckingAuth ,onlineUsers} = authStore();
  const { theme } = useThemeStore ();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log('helooooooooooooooooooo'+authUser)
  console.log("heyyy uuuuuuuu"+{ onlineUsers});

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
   
<Navbar/>
    <Routes>
      <Route path='/' element={authUser? <Homepage/> :<Navigate to='/login'/>}/>
      <Route path='/signup' element={!authUser ? <SignUppage/>:<Navigate to="/" />}/>
      <Route path='/login' element={!authUser ? <Loginpage/>:<Navigate to="/" />}/>
      <Route path='/settings' element={<Settingspage/>}/>
      <Route path='/profile' element={authUser ? <Profilepage/>:<Navigate to="/login"/>}/>
      
    </Routes>
    <Toaster />
    </div>
  )
}

export default App
