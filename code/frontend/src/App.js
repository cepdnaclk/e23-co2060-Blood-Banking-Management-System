import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./HomePage";
import DonorRegistration from "./DonorRegistration";
import CheckStatus from "./CheckStatus";
import LoginPage from "./LoginPage";

import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

import UserManagement from "./UserManagement";
import DonorManagementPage from "./DonorManagementPage";
import AdminApproval from "./AdminApproval";
import HospitalPage from "./HospitalPage";
import ScreeningPage from "./ScreeningPage";
import DonationPage from "./DonationPage";
import BloodTestingPage from "./BloodTestingPage";
import BloodComponentPage from "./BloodComponentPage";
import InventoryPage from "./InventoryPage";
import BloodIssuePage from "./BloodIssuePage";
import BloodRequestPage from "./BloodRequestPage";

function App() {
  return (
    <Router>
      <Routes>

        {/* 🌐 PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<DonorRegistration />} />
        <Route path="/status" element={<CheckStatus />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 🔒 DASHBOARD (PROTECTED) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔒 USER MANAGEMENT */}
        <Route
          path="/users"
          element={
            <ProtectedRoute feature="users">
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* 🔒 DONOR APPROVAL */}
        <Route
          path="/donor-approval"
          element={
            <ProtectedRoute feature="donorApproval">
              <AdminApproval />
            </ProtectedRoute>
          }
        />

        {/* 🔒 HOSPITAL */}
        <Route
          path="/hospitals"
          element={
            <ProtectedRoute feature="hospitals">
              <HospitalPage />
            </ProtectedRoute>
          }
        />

        {/* 🔒 SCREENING */}
        <Route
          path="/screening"
          element={
            <ProtectedRoute feature="screening">
              <ScreeningPage />
            </ProtectedRoute>
          }
        />

        {/* 🔒 DONATION (FIXED ROUTE NAME) */}
        <Route
          path="/donations"
          element={
            <ProtectedRoute feature="donation">
              <DonationPage />
            </ProtectedRoute>
          }
        />

        {/* 🔒 BLOOD TESTING */}
        <Route
          path="/blood-tests"
          element={
            <ProtectedRoute feature="bloodTesting">
              <BloodTestingPage />
            </ProtectedRoute>
          }
        />

        {/* 🔒 BLOOD COMPONENTS */}
        <Route
          path="/blood-components"
          element={
            <ProtectedRoute feature="bloodComponents">
              <BloodComponentPage />
            </ProtectedRoute>
          }
        />

        {/* 🔒 INVENTORY (if exists) */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute feature="inventory">
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        {/* 🔒 BLOOD ISSUE (if exists) */}
        <Route
          path="/blood-issue"
          element={
            <ProtectedRoute feature="bloodIssue">
              <BloodIssuePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blood-requests"
        element={
          <ProtectedRoute feature="bloodRequests">
            <BloodRequestPage />
          </ProtectedRoute>
          }
        />

        <Route
        path="/donors"
        element={
          <ProtectedRoute feature="donorManagement">
            <DonorManagementPage />
          </ProtectedRoute>
          }
        />

        {/* ❌ UNKNOWN ROUTE */}
        <Route path="*" element={<h2>Page Not Found</h2>} />

      </Routes>
    </Router>
  );
}

export default App;
