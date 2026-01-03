import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/api";
import AppLoader from "../../components/AppLoader";
import "../../styles/trainer/trainerDashboard.css";

const TrainerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await API.get("/trainer/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load trainer dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="trainer-dashboard">
        <Sidebar role="trainer" />
        <div className="dashboard-content trainer-loading">
          <AppLoader text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="trainer-dashboard">
        <Sidebar role="trainer" />
        <div className="dashboard-content">
          Failed to load dashboard
        </div>
      </div>
    );
  }

  const {
    trainer,
    trainees = [],
    totalTrainees = trainees.length,
    pendingRequests = 0,
    attendance = {},
  } = data;

  return (
    <div className="trainer-dashboard">
      <Sidebar role="trainer" />

      <div className="dashboard-content trainer-dashboard-page">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <span>Trainer</span>
        </div>

        {/* Top cards */}
        <div className="trainer-top-row">
          <div className="trainer-card profile-card">
            <div className="icon">👤</div>
            <div>
              <strong>{trainer?.name || "Trainer"}</strong>
              <p>{trainer?.coachingType || "Physical fitness coach"}</p>
            </div>
          </div>

          <div className="trainer-card stat-box">
            <span>Total Trainees</span>
            <strong>{totalTrainees}</strong>
          </div>

          <div className="trainer-card stat-box">
            <span>Recent requests</span>
            <strong>{pendingRequests}</strong>
          </div>
        </div>

        {/* Middle section */}
        <div className="trainer-middle-row">
          <div className="trainer-card trainees-list">
            <h3>Your trainees</h3>

            {trainees.length === 0 ? (
              <p className="muted">No trainees assigned</p>
            ) : (
              trainees.map((t) => (
                <div key={t._id} className="trainee-name">
                  {t.name}
                </div>
              ))
            )}
          </div>

          <div className="trainer-card attendance-box">
            <span>Attendance this month</span>

            <div className="attendance-circle">
              <strong>{attendance.presentDays || 0} days</strong>
              <p>{attendance.percentage || 0}%</p>
            </div>

            <small>{attendance.streak || 0} days streak</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
