import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import NavBar from './Components/NavBar';
import Home from './Pages/Home';
import firebase from './firebase';
import ProfileView from './Pages/ProfileView';
import SignIn from './Components/SignIn';

function App() {
  const [ user, setUser ] = useState(getAuth().currentUser);
  useEffect(() => {
    onAuthStateChanged(getAuth(), () => {
      setUser(getAuth().currentUser);
    });
  })

  if (!user) {
    return (
      <SignIn />
    )
  }
  
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/profile/:username' element={<ProfileView />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
