import { Link } from "react-router-dom";
import "../styles/landing.css";

function LandingPage() {
  return (
    <div className="landing">
      <div className="overlay">
        {/* NAVBAR */}
        <nav className="landing-nav">
          <h2 className="logo">FitClub</h2>

          <div className="nav-actions">
            <a href="#contact">Contact Us</a>
            <Link to="/login" className="login-btn">
              Log In
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-text">
            <h1>
              Train Hard.
              <br />
              Manage Smart.
            </h1>

            <p>
              A modern platform connecting Members, Trainers & Admins.
              <br />
              See membership validity, renew easily, stay updated.
            </p>

            <Link to="/login" className="primary-btn">
              Sign In
            </Link>
          </div>
        </div>

        {/* FEATURES */}
        <div className="features">
          <div className="feature-card">
            <h3>Expert Coaching</h3>
            <p>Professional trainers assigned to elevate your fitness journey.</p>
          </div>

          <div className="feature-card">
            <h3>Flexible Scheduling</h3>
            <p>Manage training times, personalized routines, and weekly plans.</p>
          </div>

          <div className="feature-card">
            <h3>Smart Tracking</h3>
            <p>Track attendance, membership validity, and progress.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
