// Updated ProtectedRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, userRole }) => {
  // Implement your authentication logic here
  // For example, check if userRole has access to this route
  if (userRole === 'admin') {
    return <Route element={element} />;
  } else {
    // Redirect to login or unauthorized page if user is not authenticated
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
