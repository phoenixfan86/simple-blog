import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePostById, deletePostById, likePost, addCommentToPost } from "@/services/dbService";
import { updatePost, deletePost, addLikeToPost, addComment } from "@/lib/redux/postSlice";
import type { Post } from "@/lib/redux/postSlice";
import { RootState } from "@/lib/redux/store";
import { z } from "zod";

const editPostSchema = z.object({
  postTitle: z.string().min(3, "Заголовок має містити щонайменше 3 символи"),
  postData: z.string().min(10, "Текст поста має містити щонайменше 10 символів"),
});

const comentsSchema = z.object({
  commentName: z.string().min(3, "Ім'я має містити щонайменше 3 символа"),
  commentText: z.string().min(10, "Вміст коментаря має містити щонайменше 10 символів"),
});

const PostItem = ({ post }: { post: Post }) => {
  const [expanded, setExpanded] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const userId = useSelector((state: RootState) => state.user.uid);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.postTitle);
  const [editedContent, setEditedContent] = useState(post.postData);
  const [editError, setEditError] = useState("");


  const [errors, setErrors] = useState<{ commentName?: string[], commentText?: string[] }>({});

  const handleSaveEdit = async () => {
    try {
      editPostSchema.parse({
        postTitle: editedTitle,
        postData: editedContent,
      });

      setEditError("");

      await updatePostById(post.id, {
        postTitle: editedTitle,
        postData: editedContent,
      });

      dispatch(updatePost({
        postId: post.id,
        postTitle: editedTitle,
        postData: editedContent,
      }));

      setIsEditing(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setEditError(err.errors[0]?.message || "Некоректні дані");
      } else {
        console.error("Помилка редагування поста:", err);
        setEditError("Сталася помилка під час збереження");
      }
    }
  };

  const handleLike = async () => {
    try {
      await likePost(post.id, userId);
      dispatch(addLikeToPost({ postId: post.id, userId }));
    } catch (error) {
      console.error("Не вдалося зберегти лайк у Firestore:", error);
    }
  };
  const handleDelete = async () => {
    await deletePostById(post.id);
    dispatch(deletePost(post.id));
  };

  const handleAddComment = async () => {
    const result = comentsSchema.safeParse({
      commentName,
      commentText,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const newComment = {
      name: commentName,
      message: commentText,
      createdAt: new Date().toISOString(),
    };

    await addCommentToPost(post.id, newComment);
    dispatch(addComment({ postId: post.id, comment: newComment }));

    setCommentName("");
    setCommentText("");
  };


  return (
    <div className="bg-2 p-4 rounded-sm ring-1 ring-zinc-300 shadow-xl overflow-hidden">
      <div className="flex flex-col justify-between gap-4">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg text-zinc-700">{post.postTitle}</h3>
          <div className="flex items-center gap-1 md:gap-2 text-zinc-600">
            <span className="material-symbols-outlined">
              person
            </span>
            <span className="text-xs md:text-sm ">Автор: {post.username}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 py-4">
          {expanded ? post.postData : `${post.postData.slice(0, 80)}...`} {/*Кількість символів які показуються в превю*/}
        </div>
        {isEditing && (
          <div className="flex flex-col gap-2 mb-4">
            <input
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              className="userInput"
            />
            <textarea
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              className="textarea min-h-25"
            />
            {editError && <p className="text-red-500 text-sm">{editError}</p>}
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} className="btn">Зберегти</button>
              <button onClick={() => setIsEditing(false)} className="btn bg-gray-300 text-black">Скасувати</button>
            </div>
          </div>
        )}

        {expanded && (
          <div className="mt-10">

            <div className="flex flex-col items-center border-t-1 border-zinc-300">
              <h4 className="font-semibold mb-2">Коментарі:</h4>
              <div className="w-full flex items-start gap-10">
                <div className="w-1/3 flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Ім’я"
                    value={commentName}
                    onChange={e => setCommentName(e.target.value)}
                    className="userInput my-1"
                  />
                  {errors.commentName && <p className="text-red-500 text-sm">{errors.commentName[0]}</p>}
                  <textarea
                    placeholder="Текст коментаря"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className="textarea my-1 min-h-25"
                  />
                  {errors.commentText && <p className="text-red-500 text-sm">{errors.commentText[0]}</p>}
                  <button onClick={handleAddComment} className="btn mt-2">Коментувати</button>

                </div>
                <div className="">
                  <ul className="mb-3">
                    {post.comments?.map((c: any, i: number) => (
                      <li key={i}>
                        <span className="font-semibold">{c.name}:</span> {c.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-end justify-between border-t-1 border-zinc-300 pt-3">
          <div className="flex items-center gap-1.5 md:gap-3 text-xs md:text-sm mt-1">
            <span className="text-sm md:text-lg text-zinc-700">{post.likes?.length || 0} </span>
            <span className="material-symbols-outlined  text-red-800">
              favorite
            </span>
            <span className="">| Коментарів: {post.comments?.length || 0}</span>
          </div>
          <button
            className="material-symbols-outlined hover:text-red-700 hover:scale-95 transition-all cursor-pointer"
            onClick={handleLike}
          >
            thumb_up
          </button>
          <div className="flex items-center gap-2 md:gap-3 p-1">
            <span onClick={() => setIsEditing(true)} className="material-symbols-outlined hover:text-blue-700 cursor-pointer">
              edit
            </span>
            <span onClick={handleDelete} className="material-symbols-outlined text-red-800 hover:scale-95 transition-all cursor-pointer" >
              delete
            </span>
            <button onClick={() => setExpanded(!expanded)} className="btn mt-1 md:mt-2">
              {expanded ? "Згорнути" : "Читати"}
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default PostItem;
