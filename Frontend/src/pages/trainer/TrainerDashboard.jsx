import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/api";
import AppLoader from "../../components/AppLoader";
import "../../styles/trainer/trainerDashboard.css";

const TrainerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const trainer = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [dashboardRes, traineesRes, requestsRes] = await Promise.all([
          API.get("/trainer/dashboard"),
          API.get("/trainer/trainees"),
          API.get("/trainer/requests"),
        ]);

        setDashboard(dashboardRes.data);
        setTrainees(traineesRes.data);
        setRequests(requestsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="member-dashboard">
        <Sidebar role="trainer" />
        <div className="dashboard-main trainer-loading">
          <AppLoader text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="member-dashboard">
        <Sidebar role="trainer" />
        <div className="dashboard-main">{error || "No data available"}</div>
      </div>
    );
  }

  const attendancePercent = dashboard.attendancePercent || 0;
  const monthlyAttendance = dashboard.monthlyAttendance || 0;

  return (
    <div className="member-dashboard">
      <Sidebar role="trainer" />

      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <span>Trainer</span>
        </div>

        {/* Top row */}
        <div className="top-row">
          <div className="card welcome-card">
            <div className="icon">👤</div>
            <div className="info">
              <strong>{trainer?.name}</strong>
              <p>{trainer?.coachingType || "Physical fitness coach"}</p>
            </div>
          </div>

          <div className="card stat-card">
            <span>Total Trainees</span>
            <h3>{dashboard.traineesCount}</h3>
          </div>

          <div className="card stat-card">
            <span>Recent Requests</span>
            <h3>{requests.length}</h3>
          </div>
        </div>

        {/* Bottom section */}
        <div className="bottom-section">
          {/* Trainees list */}
          <div className="trainees-card card">
            <span>Your trainees</span>
            <ul>
              {trainees.length > 0
                ? trainees.map((t) => <li key={t.id}>{t.name}</li>)
                : <li>No trainees yet</li>}
            </ul>
          </div>

          {/* Right column */}
          <div className="right-column">
            {/* Attendance */}
            <div className="attendance-card card">
              <span>Attendance this month</span>
              <div className="circle">
                <span>{attendancePercent}%</span>
              </div>
              <p>{monthlyAttendance} days</p>
              <small>{dashboard.streak || 0} days streak</small>
            </div>

            {/* Next session */}
            <div className="next-session card">
              <span>Next Training Session</span>
              <strong>
                {dashboard.nextSession
                  ? new Date(dashboard.nextSession).toDateString()
                  : "Not Scheduled"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
