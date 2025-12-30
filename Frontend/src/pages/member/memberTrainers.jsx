import { useEffect, useState } from "react";
import API from "../../api/api";
import Sidebar from "../../components/Sidebar";
import AppLoader from "../../components/AppLoader";
import "../../styles/member/memberTrainers.css";

const MemberTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);
      try {
        const res = await API.get("/member/trainers");
        setTrainers(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load trainers");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const handleRequest = async (trainerId) => {
    try {
      await API.post("/member/request-trainer", { trainerId });
      alert("Trainer request sent");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  if (loading) {
    return (
      <div className="member-trainers-page">
        <Sidebar role="member" />
        <div className="trainers-main member-loading">
          <AppLoader text="Loading trainers..." />
        </div>
      </div>
    );
  }

  return (
    <div className="member-trainers-page">
      <Sidebar role="member" />

      <div className="trainers-main">
        <h2>Trainers</h2>

        {error && <p className="error">{error}</p>}

        {trainers.length > 0 && (
          <div className="trainers-table">
            <div className="trainers-header-2">
              <span>Name</span>
              <span>Type</span>
              <span>Phone</span>
              <span></span>
            </div>

            <div className="trainers-body">
              {trainers.map((trainer) => (
                <div key={trainer._id} className="trainer-row">
                  <span className="trainer-name">{trainer.name}</span>
                  <span className="muted">
                    {trainer.coachingType || trainer.type || "General"}
                  </span>
                  <span className="muted">{trainer.phone}</span>
                  <button
                    className="request-btn"
                    onClick={() => handleRequest(trainer._id)}
                  >
                    Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {trainers.length === 0 && !error && <p>No trainers available</p>}
      </div>
    </div>
  );
};

export default MemberTrainers;
