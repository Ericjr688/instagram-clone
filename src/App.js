import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar';
import Home from './Pages/Home';



function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
