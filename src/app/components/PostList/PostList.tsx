"use client"

import PostItem from "./PostItem";
import { usePosts } from "@/hooks/usePosts";

const PostList = () => {
  const posts = usePosts();

  return (
    <section className="w-full flex flex-col gap-5 my-5 lg:my-10 px-5 md:px-35 lg:px-55">
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </section>
  );
};

export default PostList;
