// src/components/ProtectedRoutes.jsx

// import dependencies
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// cookie package
import Cookies from "universal-cookie";
// new cookie instance
const cookies = new Cookies();

// receive components and any other props
export default function ProtectedRoutes() {
  // check if user is authenticated (if valid token set in the cookie)
  const isAuthenticated = () => !!cookies.get("TOKEN");

  // check if valid token is set in the cookie
  if (isAuthenticated()) {
    // render the child route (dashboard)
    return <Outlet />;
  }
  // if no valid token is set
  else {
    // return user to landing page; replace current history entry
    return <Navigate to="/" replace />;
  }
}
