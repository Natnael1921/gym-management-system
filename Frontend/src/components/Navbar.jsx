import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="landing-nav navbar">
      <Link to="/" className="logo">
        FitClub
      </Link>

      <div className="nav-actions">
        <a href="#contact">Contact Us</a>
        <Link to="/login" className="login-btn">
          Log In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
