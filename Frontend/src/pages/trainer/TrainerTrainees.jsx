import { useEffect, useState } from "react";
import API from "../../api/api";
import Sidebar from "../../components/Sidebar";
import AppLoader from "../../components/AppLoader";
import "../../styles/trainer/trainerTrainees.css";

const TrainerTrainees = () => {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainees = async () => {
      setLoading(true);
      try {
        const res = await API.get("/trainer/trainees");
        setTrainees(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load trainees");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainees();
  }, []);

  if (loading) {
    return (
      <div className="trainer-trainees-page">
        <Sidebar role="trainer" />
        <div className="trainees-main loading">
          <AppLoader text="Loading trainees..." />
        </div>
      </div>
    );
  }

  return (
    <div className="trainer-trainees-page">
      <Sidebar role="trainer" />

      <div className="trainees-main">
        <div className="page-header">
          <h2>Trainees</h2>
          <span className="role-label">Trainer</span>
        </div>

        {error && <p className="error">{error}</p>}

        {trainees.length > 0 && (
          <div className="trainees-card">
            <div className="trainees-header">
              <span>Name</span>
              <span>Membership</span>
              <span>Phone no</span>
            </div>

            <div className="trainees-body">
              {trainees.map((member) => (
                <div key={member._id} className="trainee-row">
                  <div className="name-cell">
                    <img
                      src="/avatar-placeholder.png"
                      alt="avatar"
                      className="avatar"
                    />
                    <span>{member.name}</span>
                  </div>

                  <span className="muted">
                    {member.membershipValidUntil
                      ? `Valid until ${new Date(
                          member.membershipValidUntil
                        ).toLocaleDateString()}`
                      : "No active membership"}
                  </span>

                  <span className="muted">{member.phone || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {trainees.length === 0 && !error && (
          <p className="empty">No trainees assigned to you</p>
        )}
      </div>
    </div>
  );
};

export default TrainerTrainees;
