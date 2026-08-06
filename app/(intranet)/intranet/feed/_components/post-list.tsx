/** @format */

import { mockPosts } from "../../_mock";
import { IntranetPost } from "../../_types/intranet";
import { PostCard } from "./post-card";

interface PostListProps {
  posts?: readonly IntranetPost[];
}

export function PostList({ posts = mockPosts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
