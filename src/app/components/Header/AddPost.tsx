"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { addPost } from "@/lib/redux/postSlice";
import { addPost as addPostToDB } from "@/services/dbService";
import { z } from "zod";

const postSchema = z.object({
  postTitle: z.string().min(5, "Заголовок має містити щонайменше 5 символів"),
  postData: z.string().min(10, "Вміст поста має містити щонайменше 10 символів"),
});

const AddPost = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user)

  const [showForm, setShowForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postData, setPostData] = useState("");
  const [error, setError] = useState("");

  const handleCreatePost = async () => {
    try {
      postSchema.parse({ postTitle, postData });

      const postId = crypto.randomUUID();

      const newPost = {
        id: postId,
        username: user.username || "Гість",
        postTitle,
        postData,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };

      await addPostToDB(postId, newPost);
      dispatch(addPost(newPost));

      setPostTitle("");
      setPostData("");
      setError("");
      setShowForm(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || "Некоректні дані");
      } else {
        setError("Невідома помилка: " + (err as Error).message);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  }

  return (
    <div className="">
      {!showForm && (
        <button className="secondBtn" onClick={() => setShowForm(true)}>
          +<span className="label ml-2">Новий пост</span>
        </button>
      )}

      {showForm && (
        <div className="absolute  top-full w-150 right-100 flex flex-col gap-5 items-center m-5 p-6 bg shadow-xl">
          <div className="w-full flex items-center justify-between">

            <span className="text-zinc-500">Автор: {user.username || "Гість"}</span>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <h3 className="text-2xl text-zinc-600 font-semibold" >Створіть новий пост</h3>
          <div className="w-full flex">
            <div className="w-full flex flex-col justify-center gap-4 mr-3">
              <div className="w-full flex items-center">
                <label htmlFor="" className="text-sm font-semibold text-zinc-600 mr-3">
                  Заголовок:
                </label>
                <input
                  type="text"
                  placeholder="Напишіть Заголовок"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full userInput my-3"
                />
              </div>
              <label htmlFor="" className="text-sm font-semibold text-zinc-600">
                Напишіть щось
              </label>
              <textarea
                value={postData}
                onChange={(e) => setPostData(e.target.value)}
                className="textarea min-h-40"
              />

            </div>
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={handleCreatePost}
                className="thirdBtn"
              >
                Створити
              </button>
              <button
                onClick={handleCancel}
                className="delBtn"
              >
                Скасувати
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AddPost;
