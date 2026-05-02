import React from "react";
import { Navigate } from "react-router-dom";
import roleConfig from "./roleConfig";

function ProtectedRoute({ children, feature }) {
  const role = (localStorage.getItem("role") || "").trim().toUpperCase();
  const access = roleConfig[role] || [];

  if (!role) return <Navigate to="/login" />;

  if (feature) {
    const access = roleConfig[role] || [];

    if (!access.includes(feature)) {
      return <h2>Access Denied ❌</h2>;
    }
  }

  return children;
}

export default ProtectedRoute;