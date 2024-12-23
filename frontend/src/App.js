// src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import LandingPage from "./components/pages/landingPage";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import ResortDetails from "./components/pages/resortDetails";
import SearchSkiResorts from "./components/pages/searchSkiResorts";
import MapSearch from './components/pages/MapSearch'; 
import SkiResortWebcam from "./components/pages/SkiResortWebcam";
import './index.css';
import 'weather-icons/css/weather-icons.css';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
        <Route path="/searchSkiResorts" element={<SearchSkiResorts />} />
        <Route path="/resortDetails/:name" element={<ResortDetails />} />
        <Route path="/MapSearch" element={<MapSearch />} />
        <Route path="/skiResortWebcam" element={<SkiResortWebcam />} />
      </Routes>
    </>
  );
};

export default App;
