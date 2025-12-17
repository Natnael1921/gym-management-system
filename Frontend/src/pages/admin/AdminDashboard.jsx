import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/api";
import "../../styles/admin/adminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalTrainers: 0,
    income: 0,
  });
  const [membershipActivity, setMembershipActivity] = useState([]);
  const [attendanceThisWeek, setAttendanceThisWeek] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const membersRes = await API.get("/admin/members");
        const trainersRes = await API.get("/admin/trainers");

        const members = membersRes.data;
        const trainers = trainersRes.data;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const attendanceRes = await API.get("/admin/attendance/week", {
          params: {
            startDate: startDate.toISOString(),
            role: "member",
          },
        });

        setStats({
          totalMembers: members.length,
          totalTrainers: trainers.length,
          income: 200000,
        });

        const latestActivity = members.slice(-5).map((m) => ({
          name: m.name,
          status: m.membershipValid
            ? "Membership renewed"
            : "Membership expired",
        }));

        setMembershipActivity(latestActivity);

        setAttendanceThisWeek(attendanceRes.data.attendance || []);
      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
        setAttendanceThisWeek([]);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      <Sidebar role="admin" />

      <div className="dashboard-content">
        <h1 className="admin-title">Dashboard</h1>

        <div className="admin-cards">
          <div className="admin-card">
            <p>Total Members</p>
            <h2>{stats.totalMembers}</h2>
          </div>
          <div className="admin-card">
            <p>Total Trainers</p>
            <h2>{stats.totalTrainers}</h2>
          </div>
          <div className="admin-card">
            <p>Income</p>
            <h2>${stats.income}</h2>
          </div>
        </div>

        <div className="admin-bottom">
          <div className="admin-box admin-box-bottom">
            <h3>Membership Activity</h3>
            <ul className="activity-list">
              {membershipActivity.map((m, i) => (
                <li key={i}>
                  {m.name} — {m.status}
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-box admin-box-bottom">
            <h3>Attendance This Week</h3>
            {attendanceThisWeek.length === 0 ? (
              <p>No attendance data for this week.</p>
            ) : (
              <div className="attendance-chart admin-box-bottom">
                {attendanceThisWeek.map((val, idx) => (
                  <div key={idx} className="attendance-bar">
                    <div className="bar" style={{ height: `${val * 20}px` }} />
                    <span>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
