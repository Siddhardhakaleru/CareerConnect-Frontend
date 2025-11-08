import React, { useState } from "react";
import API from "../api";

export default function PostForm({ onPost }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem("name");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return alert("Post cannot be empty.");

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const res = await API.post("/posts", formData);
      onPost(res.data);
      setText("");
      setImage(null);
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h3>Start a post</h3>
      <textarea
        placeholder={`What's on your mind, ${user || "Guest"}?`}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="actions">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

