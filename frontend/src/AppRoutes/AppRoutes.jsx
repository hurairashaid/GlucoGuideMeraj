import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Home from "../pages/Home";
import { Otp } from "../components/Otp";
import Dashboard from "../pages/Dashboard";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/dashboard/*" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
