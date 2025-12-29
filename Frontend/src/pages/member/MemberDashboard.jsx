import { useEffect, useState } from "react";
import API from "../../api/api";
import "../../styles/member/memberDashboard.css";
import Sidebar from "../../components/Sidebar";

const MemberDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profileRes, attendanceRes, scheduleRes] = await Promise.all([
          API.get("/member/me"),
          API.get("/member/attendance"),
          API.get("/member/schedule"),
        ]);

        setProfile(profileRes.data);
        setAttendance(attendanceRes.data);
        setSchedule(scheduleRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="dashboard-content">Loading...</div>;
  if (error) return <div className="dashboard-content">{error}</div>;

  const presentDays = attendance.filter((a) => a.present).length;
  const totalDays = attendance.length;
  const attendancePercent =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const todaySchedule =
    schedule.length > 0 ? schedule[0].workout : "No schedule";

  return (
    <div className="member-dashboard">
      {/* Sidebar */}
      <Sidebar role="member" />

      {/* Main content */}
      <div className="dashboard-main">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Dashboard</h2>
          <span>User</span>
        </div>

        {/* Top row */}
        <div className="top-row">
          <div className="card welcome-card">
            <div className="icon">👤</div>
            <div className="info">
              <strong>{profile.name}</strong>
              <p>Physical fitness</p>
            </div>
          </div>
          <div className="card trainer-card">
            <span>Your Trainer</span>
            <strong>{profile.trainerId?.name || "Not Assigned"}</strong>
          </div>
        </div>

        {/* Middle row */}
        <div className="middle-row">
          <div className="attendance-card">
            <span>Attendance this month</span>
            <div className="circle">
              <h2>{presentDays} days</h2>
              <p>{attendancePercent}%</p>
            </div>
            <small>4 days streak</small>
          </div>

          <div className="stats">
            <div className="stat-card">
              <span>Weight</span>
              <h3>{profile.weight || "-"} Kg</h3>
            </div>
            <div className="stat-card">
              <span>Height</span>
              <h3>{profile.height || "-"} cm</h3>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="bottom-row">
          <div className="card membership-card">
            <span>Membership valid upto</span>
            <strong>
              {profile.membershipValidUntil
                ? new Date(profile.membershipValidUntil).toDateString()
                : "Not Set"}
            </strong>
          </div>

          <div className="card schedule-today-card">
            <span>Today's Schedule</span>
            <strong>{todaySchedule}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
