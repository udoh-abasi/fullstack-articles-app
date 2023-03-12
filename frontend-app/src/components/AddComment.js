const AddComment = ({ comments }) => {
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
          </div>
        );
      })}
    </>
  );
};

export default AddComment;
