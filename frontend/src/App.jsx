import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster } from "react-hot-toast"
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080B18] via-[#11132B] to-[#251044] bg-cover bg-center bg-no-repeat">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
