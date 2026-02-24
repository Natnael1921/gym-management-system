import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/sidebar.css";

const Sidebar = ({ role }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linksByRole = {
    admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Members", path: "/admin/members" },
      { name: "Trainers", path: "/admin/trainers" },
      { name: "Attendance", path: "/admin/attendance" },
    ],
    trainer: [
      { name: "Dashboard", path: "/trainer/dashboard" },
      { name: "Trainees", path: "/trainer/trainees" },
      { name: "Requests", path: "/trainer/requests" },
      { name: "Attendance", path: "/trainer/attendance" },
    ],
    member: [
      { name: "Dashboard", path: "/member/dashboard" },
      { name: "Trainers", path: "/member/trainers" },
      { name: "Schedule", path: "/member/schedule" },
      { name: "Attendance", path: "/member/attendance" },
    ],
  };

  const links = linksByRole[role] || [];

  return (
    <>
      <button className="hamburger-btn" onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </button>

      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">FitClub</div>
        <div className="sidebar-links">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active-link" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
