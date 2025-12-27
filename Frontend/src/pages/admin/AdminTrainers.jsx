import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/api";
import "../../styles/admin/adminTrainers.css";

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTrainerId, setEditTrainerId] = useState(null);

  const [trainerData, setTrainerData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    coachingType: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainersRes, membersRes] = await Promise.all([
          API.get("/admin/trainers"),
          API.get("/admin/members"),
        ]);
        setTrainers(trainersRes.data);
        setMembers(membersRes.data);
      } catch (err) {
        console.error("Failed to load trainers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMembersCount = (trainerId) => {
    return members.filter((m) => m.trainerId === trainerId).length;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrainerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEditTrainer = async (e) => {
    e.preventDefault();
    try {
      if (editTrainerId) {
        // Edit trainer
        const res = await API.put(`/admin/trainers/${editTrainerId}`, trainerData);
        setTrainers((prev) =>
          prev.map((t) => (t._id === editTrainerId ? res.data : t))
        );
      } else {
        // Add trainer
        const res = await API.post("/admin/trainers", trainerData);
        setTrainers((prev) => [...prev, res.data]);
      }

      setShowModal(false);
      setEditTrainerId(null);
      setTrainerData({
        name: "",
        email: "",
        password: "",
        phone: "",
        coachingType: "",
      });
    } catch (err) {
      console.error("Failed:", err);
      alert(err.response?.data?.error || "Error adding/updating trainer");
    }
  };

  const handleEditClick = (trainer) => {
    setTrainerData({
      name: trainer.name,
      email: trainer.email,
      password: "", 
      phone: trainer.phone || "",
      coachingType: trainer.coachingType || "",
    });
    setEditTrainerId(trainer._id);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <Sidebar role="admin" />
        <div className="dashboard-content admin-loading">
          Loading trainers...
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${showModal ? "blurred" : ""}`}>
      <Sidebar role="admin" />
      <div className="dashboard-content">
        {/* Header */}
        <div className="trainers-header">
          <h1>Trainers</h1>
          <button
            className="add-trainer-btn"
            onClick={() => {
              setShowModal(true);
              setEditTrainerId(null);
              setTrainerData({
                name: "",
                email: "",
                password: "",
                phone: "",
                coachingType: "",
              });
            }}
          >
            + Add Trainer
          </button>
        </div>

        {/* Table */}
        <div className="trainers-table">
          <div className="table-head">
            <span>Name</span>
            <span>Phone no</span>
            <span>Specialty</span>
            <span>Members</span>
            <span></span>
          </div>

          {trainers.map((trainer) => (
            <div className="table-row" key={trainer._id}>
              <span>{trainer.name}</span>
              <span>{trainer.phone || "—"}</span>
              <span>{trainer.coachingType || "—"}</span>
              <span>{getMembersCount(trainer._id)}</span>
              <span className="edit-link" onClick={() => handleEditClick(trainer)}>
                edit info
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Trainer */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editTrainerId ? "Edit Trainer" : "Add New Trainer"}</h2>
            <form onSubmit={handleAddEditTrainer} className="modal-form">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={trainerData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={trainerData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={trainerData.password}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={trainerData.phone}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="coachingType"
                placeholder="Specialty"
                value={trainerData.coachingType}
                onChange={handleInputChange}
              />

              <div className="modal-buttons">
                <button type="submit">{editTrainerId ? "Save Changes" : "Add Trainer"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditTrainerId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrainers;