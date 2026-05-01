import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ isLoggedIn, children }) {
  // If there is no token/not logged in, redirect to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, let them through to the component
  return children;
}
