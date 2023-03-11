const AddComment = ({ comments }) => {
  return (
    <>
      <h3>Comments</h3>
      {comments.map((eachComment, index) => (
        <div key={index} className="comment">
          <h4> {eachComment.postedBy} </h4>
          <p>{eachComment.text}</p>
        </div>
      ))}
    </>
  );
};

export default AddComment;
