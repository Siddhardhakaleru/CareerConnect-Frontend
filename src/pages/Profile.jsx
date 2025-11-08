import React, { useEffect, useState } from "react";
import API from "../api";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", about: "", skills: "" });
  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setFormData({
          name: res.data.name || "",
          about: res.data.about || "",
          skills: res.data.skills?.join(", ") || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updated profile
  const handleSave = async () => {
    try {
      const res = await API.put("/profile/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  if (!profile) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-container">
      {/* 🔙 Back button */}
      <button
        className="back-btn"
        onClick={() => (window.location.href = "/")}
      >
        ← Back to Feed
      </button>

      <div className="profile-header">
        <div className="profile-avatar">
          {profile.name?.charAt(0).toUpperCase()}
        </div>
        <h2 className="profile-name">{profile.name}</h2>
        <p className="profile-email">{profile.email}</p>
      </div>

      {editing ? (
        <div className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
          </div>
          <div className="button-group">
            <button className="btn save-btn" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn cancel-btn"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-details">
          <div>
            <h3>About</h3>
            <p>{profile.about || "No bio added yet."}</p>
          </div>
          <div>
            <h3>Skills</h3>
            <p>
              {profile.skills?.length
                ? profile.skills.join(", ")
                : "No skills listed."}
            </p>
          </div>
          <div className="edit-button-container">
            <button
              className="btn edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
