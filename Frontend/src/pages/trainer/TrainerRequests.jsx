import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/api";
import AppLoader from "../../components/AppLoader";
import "../../styles/trainer/trainerRequests.css";

const TrainerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/trainer/requests");
        setRequests(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      await API.post(`/trainer/requests/${id}/approve`);
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "approved" } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert("Approve failed");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await API.post(`/trainer/requests/${id}/reject`);
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "rejected" } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert("Reject failed");
    }
  };

  if (loading) {
    return (
      <div className="trainer-requests-page">
        <Sidebar role="trainer" />
        <div className="requests-main loading">
          <AppLoader text="Loading requests..." />
        </div>
      </div>
    );
  }

  return (
    <div className="trainer-requests-page">
      <Sidebar role="trainer" />

      <div className="requests-main">
        <div className="page-header">
          <h2>Requests</h2>
          <span className="role-label">Trainer</span>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="requests-card">
          {requests.length === 0 ? (
            <p className="empty">No requests</p>
          ) : (
            requests.map((req) => (
              <div key={req._id} className="request-row">
                <span className="name">
                  {req.memberId?.name || "Unknown"}
                </span>

                <span className="phone">
                  {req.memberId?.phone || "-"}
                </span>

                {req.status === "pending" ? (
                  <div className="actions">
                    <button
                      className="btn accept"
                      onClick={() => approveRequest(req._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn reject"
                      onClick={() => rejectRequest(req._id)}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className={`status ${req.status}`}>
                    {req.status}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerRequests;
