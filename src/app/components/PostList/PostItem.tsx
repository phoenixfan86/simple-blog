import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePostById, addCommentToPost } from "@/services/dbService";
import { deletePost, addLikeToPost, addComment } from "@/lib/redux/postSlice";
import { RootState } from "@/lib/redux/store";

const PostItem = ({ post }: { post: any }) => {
  const [expanded, setExpanded] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const userId = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLike = () => {
    dispatch(addLikeToPost({ postId: post.id, userId }));
  };
  const handleDelete = async () => {
    await deletePostById(post.id);
    dispatch(deletePost(post.id));
  };

  const handleAddComment = async () => {
    if (!commentName || !commentText) return;

    const newComment = {
      name: commentName,
      message: commentText,
      createdAt: new Date().toISOString()
    };

    await addCommentToPost(post.id, newComment);
    dispatch(addComment({ postId: post.id, comment: newComment }));

    setCommentName("");
    setCommentText("");
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold text-lg">{post.postTitle}</h3>
      <div className="text-sm text-gray-500">Автор: {post.username}
        {expanded ? post.postData : `${post.postData.slice(0, 80)}...`}
      </div>
      <div className="text-sm mt-1">{post.likes?.length || 0} ❤️ | Коментарів: {post.comments?.length || 0}</div>

      <button onClick={() => setExpanded(!expanded)} className="btn mt-2">
        {expanded ? "Згорнути" : "Детальніше"}
      </button>

      {expanded && (
        <div className="mt-4">
          <button
            className="text-red-500 hover:underline"
            onClick={handleLike}
          >
            ❤️ Лайк
          </button>
          <h4 className="font-semibold mb-2">Коментарі:</h4>
          <ul className="mb-3">
            {post.comments?.map((c: any, i: number) => (
              <li key={i}>
                <span className="font-semibold">{c.name}:</span> {c.message}
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="Ваше ім’я"
            value={commentName}
            onChange={e => setCommentName(e.target.value)}
            className="userInput my-1"
          />
          <input
            type="text"
            placeholder="Ваш коментар"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="userInput my-1"
          />
          <button onClick={handleAddComment} className="btn mt-2">Коментувати</button>


          <button onClick={handleDelete} className="btn bg-red-500 mt-3 ml-2">Видалити</button>

        </div>
      )}
    </div>
  );
};

export default PostItem;
