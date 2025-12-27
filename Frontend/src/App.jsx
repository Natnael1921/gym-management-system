import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/landingPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import MemberDashboard from "./pages/member/MemberDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminTrainers from "./pages/admin/AdminTrainers";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
              <ProtectedRoute role="admin">
                <AdminMembers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trainers"
            element={
              <ProtectedRoute role="admin">
                <AdminTrainers />
              </ProtectedRoute>
            }
          />

          {/* Trainer Routes */}
          <Route
            path="/trainer/dashboard"
            element={
              <ProtectedRoute role="trainer">
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Member Routes */}
          <Route
            path="/member/dashboard"
            element={
              <ProtectedRoute role="member">
                <MemberDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
