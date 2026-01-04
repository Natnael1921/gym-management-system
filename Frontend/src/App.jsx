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
import AdminAttendance from "./pages/admin/AdminAttendance";
import MemberTrainers from "./pages/member/memberTrainers";
import MemberSchedule from "./pages/member/MemberSchedule";
import MemberAttendance from "./pages/member/MemberAttendance";
import TrainerTrainees from "./pages/trainer/TrainerTrainees";

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
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute role="admin">
                <AdminAttendance />
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
          <Route
            path="/trainer/trainees"
            element={
              <ProtectedRoute role="trainer">
                <TrainerTrainees />
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
          <Route
            path="/member/trainers"
            element={
              <ProtectedRoute role="member">
                <MemberTrainers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/schedule"
            element={
              <ProtectedRoute role="member">
                <MemberSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/attendance"
            element={
              <ProtectedRoute role="member">
                <MemberAttendance />
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
