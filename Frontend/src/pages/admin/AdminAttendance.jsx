import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/api";
import "../../styles/admin/adminAttendance.css";
import AppLoader from "../../components/AppLoader";

const AdminAttendance = () => {
  const [role, setRole] = useState("member");
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [users, setUsers] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);

  const weekDays = getWeekDays(weekStart);

  useEffect(() => {
    fetchAttendance();
  }, [role, weekStart]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/attendance/week", {
        params: {
          startDate: formatDate(weekStart),
          role,
        },
      });

      setUsers(res.data.users || []);

      const map = {};
      res.data.attendance.forEach((a) => {
        const day = formatDate(new Date(a.date));
        if (!map[a.userId]) map[a.userId] = {};
        map[a.userId][day] = a.present;
      });

      setAttendanceMap(map);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (userId, date) => {
    const day = formatDate(date);
    const current = attendanceMap[userId]?.[day];

    let nextValue;
    if (current === undefined) nextValue = true;
    else if (current === true) nextValue = false;
    else nextValue = true;

    try {
      await API.post("/admin/attendance/mark", {
        userId,
        date: day,
        present: nextValue,
      });

      setAttendanceMap((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          [day]: nextValue,
        },
      }));
    } catch (err) {
      console.error("Attendance update failed", err);
    }
  };

  if (loading) {
  return (
    <div className="admin-dashboard">
      <Sidebar role="admin" />
      <div className="dashboard-content admin-loading">
        <AppLoader text="Loading attendance..." />
      </div>
    </div>
  );
}

  return (
    <div className="admin-dashboard">
      <Sidebar role="admin" />

      <div className="dashboard-content admin-attendance">
        <h1>Attendance</h1>

        <div className="attendance-toggle">
          <button
            className={role === "member" ? "active" : ""}
            onClick={() => setRole("member")}
          >
            Member
          </button>
          <button
            className={role === "trainer" ? "active" : ""}
            onClick={() => setRole("trainer")}
          >
            Trainer
          </button>
        </div>

        <div className="week-nav">
          <button
            onClick={() =>
              setWeekStart(
                (prev) => new Date(new Date(prev).setDate(prev.getDate() - 7))
              )
            }
          >
            ‹
          </button>

          <span>
            {weekDays[0].toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
            })}{" "}
            -{" "}
            {weekDays[6].toLocaleDateString("en-US", {
              day: "2-digit",
            })}
          </span>

          <button
            onClick={() =>
              setWeekStart(
                (prev) => new Date(new Date(prev).setDate(prev.getDate() + 7))
              )
            }
          >
            ›
          </button>
        </div>

        <div className="attendance-table">
          <div className="attendance-head">
            <span>Name</span>
            {weekDays.map((d) => (
              <span key={d}>
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
            ))}
          </div>

          <div className="attendance-body">
            {users.map((u) => (
              <div className="attendance-row" key={u._id}>
                <span className="sticky-name">{u.name}</span>

                {weekDays.map((d) => {
                  const day = formatDate(d);
                  const present = attendanceMap[u._id]?.[day];

                  return (
                    <span
                      key={day}
                      className={`attendance-cell ${
                        present === true
                          ? "present"
                          : present === false
                          ? "absent"
                          : ""
                      }`}
                      onClick={() => toggleAttendance(u._id, d)}
                    >
                      {present === true ? "✓" : present === false ? "✕" : ""}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const formatDate = (date) => date.toISOString().split("T")[0];

const getWeekDays = (start) =>
  [...Array(7)].map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

export default AdminAttendance;
