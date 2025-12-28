import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api/api";
import "../../styles/admin/adminMembers.css";
import AppLoader from "../../components/AppLoader";

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    membershipValidUntil: "",
    trainerId: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, trainersRes] = await Promise.all([
          API.get("/admin/members"),
          API.get("/admin/trainers"),
        ]);
        setMembers(membersRes.data);
        setTrainers(trainersRes.data);
      } catch (err) {
        console.error("Failed to load members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTrainerName = (trainerId) => {
    const trainer = trainers.find((t) => t._id === trainerId);
    return trainer ? trainer.name : "—";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Edit member
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      if (editMemberId) {
        // Edit member
        const res = await API.put(`/admin/members/${editMemberId}`, newMember);
        setMembers((prev) =>
          prev.map((m) => (m._id === editMemberId ? res.data.member : m))
        );
      } else {
        // Add member
        const res = await API.post("/admin/members", newMember);
        setMembers((prev) => [...prev, res.data.member]);
      }

      setShowModal(false);
      setEditMemberId(null);
      setNewMember({
        name: "",
        email: "",
        password: "",
        phone: "",
        membershipValidUntil: "",
        trainerId: "",
        height: "",
        weight: "",
      });
    } catch (err) {
      console.error("Failed:", err);
      alert(err.response?.data?.error || "Error adding/updating member");
    }
  };

  const handleEditClick = (member) => {
    setNewMember({
      name: member.name,
      email: member.email,
      password: "", 
      phone: member.phone || "",
      membershipValidUntil: member.membershipValidUntil
        ? member.membershipValidUntil.slice(0, 10)
        : "",
      trainerId: member.trainerId || "",
      height: member.height || "",
      weight: member.weight || "",
    });
    setEditMemberId(member._id);
    setShowModal(true);
  };


if (loading) {
  return (
    <div className="admin-dashboard">
      <Sidebar role="admin" />
      <div className="dashboard-content admin-loading">
        <AppLoader text="Loading members..." />
      </div>
    </div>
  );
}


  return (
    <div className={`admin-dashboard ${showModal ? "blurred" : ""}`}>
      <Sidebar role="admin" />

      <div className="dashboard-content">
        {/* Header */}
        <div className="members-header">
          <h1>Members</h1>
          <button className="add-member-btn" onClick={() => { setShowModal(true); setEditMemberId(null); }}>
            + Add member
          </button>
        </div>

        {/* Table */}
        <div className="members-table">
          <div className="table-head">
            <span>Name</span>
            <span>Trainer</span>
            <span>Membership</span>
            <span>Phone no</span>
            <span></span>
          </div>

          {members.map((member) => (
            <div className="table-row" key={member._id}>
              <span>{member.name}</span>
              <span>{getTrainerName(member.trainerId)}</span>
              <span>
                {member.membershipValidUntil
                  ? `Valid until ${new Date(
                      member.membershipValidUntil
                    ).toLocaleDateString()}`
                  : "—"}
              </span>
              <span>{member.phone || "—"}</span>
              <span className="edit-link" onClick={() => handleEditClick(member)}>
                edit info
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Member */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editMemberId ? "Edit Member" : "Add New Member"}</h2>
            <form onSubmit={handleAddMember} className="modal-form">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newMember.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newMember.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newMember.password}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newMember.phone}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="membershipValidUntil"
                placeholder="Membership Valid Until"
                value={newMember.membershipValidUntil}
                onChange={handleInputChange}
              />
              <select
                name="trainerId"
                value={newMember.trainerId}
                onChange={handleInputChange}
              >
                <option value="">Select Trainer</option>
                {trainers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={newMember.height}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={newMember.weight}
                onChange={handleInputChange}
              />

              <div className="modal-buttons">
                <button type="submit">{editMemberId ? "Save Changes" : "Add Member"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditMemberId(null);
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

export default AdminMembers;
