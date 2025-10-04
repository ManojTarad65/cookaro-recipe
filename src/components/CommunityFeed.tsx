"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

interface CommunityPostProps {
  username: string;
  avatar: string;
  title: string;
  content: string;
  likes?: number;
  comments?: number;
}

export default function CommunityPost({
  username,
  avatar,
  title,
  content,
  likes = 0,
  comments = 0,
}: CommunityPostProps) {
  const [likeCount, setLikeCount] = useState(likes);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img
          src={avatar}
          alt={username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-bold">{username}</h3>
          <p className="text-gray-500 text-sm">Just now</p>
        </div>
      </div>

      {/* Content */}
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{content}</p>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setLikeCount(likeCount + 1)}
          className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition"
        >
          <Heart size={18} /> {likeCount}
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition">
          <MessageCircle size={18} /> {comments}
        </button>
      </div>
    </div>
  );
}
