import { useEffect, useState } from "react";
import API from "../../api/api";
import Sidebar from "../../components/Sidebar";
import AppLoader from "../../components/AppLoader";
import "../../styles/Member/memberSchedule.css";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MemberSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await API.get("/member/schedule");

      const fullSchedule = DAYS.map((day) => {
        const found = res.data.find((s) => s.day === day);
        return {
          day,
          workout: found?.workout || "",
        };
      });

      setSchedule(fullSchedule);
    } catch (err) {
      console.error(err);
      setError("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (day, value) => {
    setSchedule((prev) =>
      prev.map((s) =>
        s.day === day ? { ...s, workout: value } : s
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put("/member/schedule", { schedule });
      setEditing(false);
      alert("Schedule updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update schedule");
    } finally {
      setSaving(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todaySchedule = schedule.find((s) => s.day === today);

  if (loading) {
    return (
      <div className="member-schedule-page">
        <Sidebar role="member" />
        <div className="schedule-main member-loading">
          <AppLoader text="Loading schedule..." />
        </div>
      </div>
    );
  }

  return (
    <div className="member-schedule-page">
      <Sidebar role="member" />

      <div className="schedule-main">
        <h2>Workout Schedule</h2>

        {error && <p className="error">{error}</p>}

        {/*  WEEKLY SCHEDULE  */}
        <div className="schedule-top">
          <div className="schedule-table">
            <div className="schedule-header">
              <span>Day</span>
              <span>Workout</span>
            </div>

            {schedule.map((item) => (
              <div className="schedule-row" key={item.day}>
                <span className="day">{item.day}</span>

                {editing ? (
                  <input
                    type="text"
                    value={item.workout}
                    placeholder="Enter workout"
                    onChange={(e) =>
                      handleChange(item.day, e.target.value)
                    }
                  />
                ) : (
                  <span className="muted">
                    {item.workout || "Rest"}
                  </span>
                )}
              </div>
            ))}
          </div>

          {!editing ? (
            <button
              className="edit-schedule-btn"
              onClick={() => setEditing(true)}
            >
              Edit Schedule
            </button>
          ) : (
            <div className="edit-actions">
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setEditing(false);
                  fetchSchedule();
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/*  TODAY'S WORKOUT */}
        <div className="today-schedule">
          <h3>Today’s Workout</h3>

          <div className="today-card">
            <div className="today-overlay">
              <span className="today-day">{today}</span>
              <h4>{todaySchedule?.workout || "Rest Day"}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberSchedule;
