import {doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, arrayUnion, collection} from "firebase/firestore";
import { db } from "@/lib/firestore";
import { UserState } from "@/lib/redux/userSlice";
import { Post } from "@/lib/redux/postSlice";


export const addUser = async (userId: string, data: UserState) => {
  await setDoc(doc(db, "users", userId), data);
};

export const getUser = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const addPost=async(postId: string, data: Post)=>{
await setDoc(doc(db, "posts", postId), data);
}

export const updatePostById = async (postId: string, data: { postTitle: string; postData: string }) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    postTitle: data.postTitle,
    postData: data.postData,
    updatedAt: new Date().toISOString(),
  });
};

export const getPost = async (postId: string) =>{
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export const getAllPost = async () => {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      username: data.username,
      postTitle: data.postTitle,
      postData: data.postData,
      createdAt: data.createdAt,
      likes: data.likes || [],
      comments: data.comments || [],
    };
  });
  return posts;
};

export const deletePostById = async (postId: string) => {
  await deleteDoc(doc(db, "posts", postId));
};

export const likePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayUnion(userId),
  });
};

export const addCommentToPost = async (postId: string, comment: { name: string; message: string; createdAt: string }) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    comments: arrayUnion(comment)
  });
};

