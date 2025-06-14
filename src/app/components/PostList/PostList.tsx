"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "@/services/dbService";
import { setPosts } from "@/lib/redux/postSlice";
import { RootState } from "@/lib/redux/store";
import PostItem from "./PostItem";

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getAllPost();
      dispatch(setPosts(posts));
    };
    fetchPosts();
  }, []);

  return (
    <section className="w-full flex flex-col gap-5 mt-10 px-4">
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </section>
  );
};

export default PostList;
