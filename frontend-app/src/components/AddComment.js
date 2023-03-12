import { AiFillDelete } from "react-icons/ai";
import useUser from "../hooks/useUser";
import axios from "axios";

const AddComment = ({ comments, onSendSetArticleInfo, articleID }) => {
  const [user] = useUser();

  const deleteComment = async (e) => {
    const text = e.target.getAttribute("data-text");

    const authtoken = user && (await user.getIdToken());
    const headers = authtoken ? { authtoken } : {};

    const response = await axios.post(
      `/api/articles/${articleID}/deleteComment`,
      { text },
      { headers }
    );
    const theData = response.data;

    if (theData) {
      onSendSetArticleInfo(theData);
    }
  };

  return (
    <>
      <h3>Comments</h3>
      {comments.map((eachComment, index) => {
        let commentPostedBy = eachComment.postedBy;
        const indexOfDot = commentPostedBy.indexOf(".");
        const indexOfAt = commentPostedBy.indexOf("@");

        if (indexOfDot < indexOfAt) {
          commentPostedBy = commentPostedBy.slice(0, indexOfDot);
        } else {
          commentPostedBy = commentPostedBy.slice(0, indexOfAt);
        }

        commentPostedBy =
          commentPostedBy.charAt(0).toUpperCase() + commentPostedBy.slice(1);

        return (
          <div key={index} className="comment">
            <h4> {commentPostedBy} </h4>
            <p>{eachComment.text}</p>
            {user && eachComment.postedBy === user.email && (
              <button
                data-text={eachComment.text}
                type="button"
                onClick={(e) => deleteComment(e)}
              >
                <AiFillDelete />
              </button>
            )}
          </div>
        );
      })}
    </>
  );
};

export default AddComment;
