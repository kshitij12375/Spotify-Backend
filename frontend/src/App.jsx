import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { useAuthStore } from './store/useAuthStore'

import {Loader} from 'lucide-react';

import {Toaster} from 'react-hot-toast';
import Album from './pages/Album'
import { useMusicStore } from './store/useMusicStore'
import Upload from './pages/Upload'




const App = () => {

  const {checkAuth,authUser,isCheckingAuth,}=useAuthStore();
  const {Id}=useMusicStore();






   useEffect(() => {
    checkAuth();
  }, [checkAuth])


  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div>

      <Navbar/>

      <Routes>

        <Route path="/" element={authUser ? <Home/> : <Navigate to="/login"/> }/>
        <Route path="/login" element={!authUser ? <Login/> : <Navigate to="/"/>}/>
        <Route path="/sign" element={!authUser ? <SignUp/> : <Navigate to="/"/>} />
        <Route path="/album" element={Id ? <Album/> :  <Navigate to="/"/>} />
        <Route path="/upload" element={authUser?.user?.role === 'artist' ? <Upload/> : <Navigate to={authUser ? "/" : "/login"} />} />


      </Routes>
      

      <Toaster/>
    </div>
  )
}

export default App
