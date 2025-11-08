import React, { useEffect, useState } from "react";
import API from "../api";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDelete = (id) => {
    console.log("Removing post from feed:", id);
    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== id));
  };

  const handleLike = (id, updatedLikes) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p._id === id ? { ...p, likes: updatedLikes } : p
      )
    );
  };

  return (
    <div
      
    >
      <PostForm onPost={handleNewPost} />
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <PostCard post={post} onDelete={handleDelete} onLike={handleLike} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
