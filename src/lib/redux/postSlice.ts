import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

interface Post {
  id: string;
  username: string;
  postTitle: string;
  postData: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
}

interface PostsState {
  posts: Post[];
}

const initialState: PostsState = {
  posts: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts.push(action.payload);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    addLikeToPost(state, action: PayloadAction<{postId:string, userId:any}>){
      const { postId, userId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post && !post.likes.includes(userId)) {
        post.likes.push(userId);
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
  },
});

export const { setPosts, addPost, deletePost, addLikeToPost, addComment } = postsSlice.actions;
export default postsSlice.reducer;
