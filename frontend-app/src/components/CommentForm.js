import axios from "axios";
import { useState } from "react";
import useUser from "../hooks/useUser";

const CommentForm = ({ onsendArticlesInfo, articleID }) => {
  const [comment, setComment] = useState("");
  const [user] = useUser();

  const addComment = async () => {
    const authtoken = user && (await user.getIdToken());
    const headers = authtoken ? { authtoken } : {};
    const response = await axios.post(
      `/api/articles/${articleID}/comments`,
      {
        text: comment,
      },
      { headers }
    );
    const theData = response.data;

    if (theData) {
      onsendArticlesInfo(theData);
      setComment("");
    }
  };

  const commentPostedBy = () => {
    let commentPostedBy = user.email;
    const indexOfDot = commentPostedBy.indexOf(".");
    const indexOfAt = commentPostedBy.indexOf("@");

    if (indexOfDot < indexOfAt) {
      commentPostedBy = commentPostedBy.slice(0, indexOfDot);
    } else {
      commentPostedBy = commentPostedBy.slice(0, indexOfAt);
    }

    commentPostedBy =
      commentPostedBy.charAt(0).toUpperCase() + commentPostedBy.slice(1);
    return commentPostedBy;
  };

  return (
    <div id="add-comment-form">
      {user ? (
        <>
          <h3>Add a Comment</h3>
          <p> You are posting as {user && commentPostedBy()} </p>
          <textarea
            rows="4"
            cols="50"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button type="button" onClick={addComment}>
            Add Comment
          </button>
        </>
      ) : (
        <button type="button">Log in to add comments</button>
      )}
    </div>
  );
};

export default CommentForm;
