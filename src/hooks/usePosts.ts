
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "@/services/dbService";
import { setPosts } from "@/lib/redux/postSlice";
import { RootState } from "@/lib/redux/store";


export const usePosts = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsFromDb = await getAllPost();
      dispatch(setPosts(postsFromDb));
    };
    fetchPosts();
  }, [dispatch]);

  return posts;
};
