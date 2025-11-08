import React, { useState } from "react";
import API from "../api";
import { FaThumbsUp, FaTrashAlt, FaComment, FaEdit } from "react-icons/fa";
import "../Post.css";

export default function PostCard({ post, onDelete, onLike }) {
  const [deleting, setDeleting] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 👈 edit mode
  const [editText, setEditText] = useState(post.text); // 👈 editable text

  const currentUser = localStorage.getItem("name");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  

  // 👍 Like / Unlike
  const handleLike = async () => {
    try {
      // Optimistic UI update
      const hasLiked = likes.includes(userId);
      const updatedLikes = hasLiked
        ? likes.filter((id) => id !== userId)
        : [...likes, userId];

      setLikes(updatedLikes);
      onLike(post._id, updatedLikes);

      // Sync with backend
      const res = await API.put(
        `/posts/like/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikes(res.data);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // 💬 Add Comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await API.post(
        `/posts/${post._id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
      setCommentText("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  // 🗑️ Delete Post
  const handleDelete = async () => {
    if (deleting) return;
    if (!window.confirm("Delete this post?")) return;

    setDeleting(true);
    try {
      await API.delete(`/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Deleted post:", post._id);
      onDelete(post._id);
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
    } finally {
      setDeleting(false);
    }
  };

   const handleEdit = async () => {
    if (!editText.trim()) return alert("Post cannot be empty!");
    try {
      const res = await API.put(
        `/posts/${post._id}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      post.text = res.data.text;
      setIsEditing(false);
    } catch (err) {
      console.error("Edit post error:", err);
    }
  };


  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-author">
          <div className="avatar">{post.authorName?.charAt(0).toUpperCase()}</div>
          <div>
            <p className="author-name">{post.authorName}</p>
            <p className="timestamp">
              {new Date(post.createdAt).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>

        {/* {post.authorName?.toLowerCase() === currentUser?.toLowerCase() && (
          <button className="delete-btn" onClick={handleDelete} disabled={deleting}>
            {deleting ? "⏳" : <FaTrashAlt />}
          </button>
        )} */}
         {/* Edit & Delete Buttons */}
        {post.authorName?.toLowerCase() === currentUser?.toLowerCase() && (
          <div className="actions">
            {!isEditing && (
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
                title="Edit Post"
              >
                <FaEdit />
              </button>
            )}
            <button
              className="delete-btn"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete Post"
            >
              {deleting ? "⏳" : <FaTrashAlt />}
            </button>
          </div>
        )}
      </div>
      {/* Post Content */}
      <div className="post-content">
        {isEditing ? (
          <div className="edit-section">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-input"
            />
            <div className="edit-actions">
              <button className="save-btn" onClick={handleEdit}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setEditText(post.text);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p>{post.text}</p>
            {post.image && (
              <img
                src={`http://localhost:5001${post.image}`}
                alt="Post"
                className="post-image"
              />
            )}
          </>
        )}
      </div>

      {/* Content */}
      {/* <div className="post-content">
        <p>{post.text}</p>
        {post.image && (
          <img
            src={`http://localhost:5001${post.image}`}
            alt="Post"
            className="post-image"
          />
        )}
      </div> */}

      {/* Footer Buttons */}
      <div className="post-footer">
        <button
          className={`like-btn ${likes.includes(userId) ? "liked" : ""}`}
          onClick={handleLike}
        >
          <FaThumbsUp /> &nbsp; {likes.length} Likes
        </button>

        <button
          className="comment-btn"
          onClick={() => setShowComments((prev) => !prev)}
        >
          <FaComment /> &nbsp; {comments.length} Comments
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="comment-input"
            />
            <button type="submit" className="comment-submit">
              Post
            </button>
          </form>

          {comments.map((c, i) => (
            <p key={i} className="comment">
              💬 {c}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
