import React from "react";
import "../App.css";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    window.location.href = "/login";
  };

  const currentUser = localStorage.getItem("name");

  // ✅ Navigate to profile page when clicking on user name or icon
  const handleProfileClick = () => {
    if (localStorage.getItem("token")) {
      window.location.href = "/profile";
    } else {
      alert("Please log in to view profile.");
    }
  };

  return (
    <nav className="navbar">
      <h2>Connect Career</h2>

      <div>
        <span
          className="nav-user"
          onClick={handleProfileClick}
          title="View Profile"
        >
          👤 {currentUser || "Guest"}
        </span>
        {currentUser && (
          <button
            onClick={handleLogout}
            onMouseOver={(e) => {
              e.target.style.background = "#004182";
              e.target.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#0a66c2";
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
