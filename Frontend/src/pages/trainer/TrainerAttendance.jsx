import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/api";
import AppLoader from "../../components/AppLoader";
import "../../styles/Trainer/trainerAttendance.css";

//  Helpers 
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

//  Component 
const TrainerAttendance = () => {
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [attendanceMap, setAttendanceMap] = useState({});
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekDays = getWeekDays(weekStart);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await API.get("/trainer/attendance/week", {
        params: {
          startDate: formatDate(weekStart),
        },
      });

      setAttendanceList(res.data);

      const map = {};
      res.data.forEach((a) => {
        map[formatDate(new Date(a.date))] = a.present;
      });

      setAttendanceMap(map);
    } catch (err) {
      console.error("Failed to load trainer attendance", err);
    } finally {
      setLoading(false);
    }
  };

  const presentDays = attendanceList.filter((a) => a.present).length;
  const totalDays = attendanceList.length;
  const percent =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Productive day
  const dayCounter = {};
  attendanceList.forEach((a) => {
    if (a.present) {
      const day = new Date(a.date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      dayCounter[day] = (dayCounter[day] || 0) + 1;
    }
  });

  const productiveDay =
    Object.keys(dayCounter).length > 0
      ? Object.keys(dayCounter).reduce((a, b) =>
          dayCounter[a] > dayCounter[b] ? a : b,
        )
      : "-";

  //  Loading UI 
  if (loading) {
    return (
      <div className="trainer-attendance-page">
        <Sidebar role="trainer" />
        <div className="dashboard-content trainer-loading">
          <AppLoader text="Loading attendance..." />
        </div>
      </div>
    );
  }

  //  Main UI 
  return (
    <div className="trainer-attendance-page">
      <Sidebar role="trainer" />

      <div className="dashboard-content trainer-attendance">
        <h1>Attendance</h1>

        <div className="trainer-attendance-top">
          <div className="attendance-summary">
            <span>Attendance this month</span>

            <div className="attendance-circle">
              <strong>{presentDays} days</strong>
              <small>{percent}%</small>
            </div>

            <p className="streak">4 days streak</p>
          </div>

          <div className="productive-day">
            <span>Your Most Productive day</span>
            <strong>{productiveDay}</strong>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="week-nav">
          <button
            onClick={() =>
              setWeekStart(
                (prev) => new Date(new Date(prev).setDate(prev.getDate() - 7)),
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
                (prev) => new Date(new Date(prev).setDate(prev.getDate() + 7)),
              )
            }
          >
            ›
          </button>
        </div>

        {/* Week Grid */}
        <div className="trainer-week-grid">
          {weekDays.map((d) => {
            const dayKey = formatDate(d);
            const present = attendanceMap[dayKey];

            return (
              <div
                key={dayKey}
                className={`day-cell ${
                  present === true
                    ? "present"
                    : present === false
                      ? "absent"
                      : ""
                }`}
              >
                <span className="day-name">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="day-mark">
                  {present === true ? "✓" : present === false ? "✕" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrainerAttendance;
