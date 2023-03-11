import articles from "./articles-content";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import axios from "axios";
import { useEffect, useState } from "react";
import AddComment from "../components/AddComment";
import CommentForm from "../components/CommentForm";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import useUser from "../hooks/useUser";

const ArticlePage = () => {
  const { articleID } = useParams();
  const [user, isLoading] = useUser();

  const [articleInfo, setArticleInfo] = useState({
    articleName: "learn-react",
    upvote: 0,
    comment: [],
    canUpvote: false,
  });

  const theArticle = articles.find((article) => article.name === articleID);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Effect has been used");
      const authtoken = user && (await user.getIdToken());
      const headers = authtoken ? { authtoken } : {};

      const response = await axios.get(`/api/articles/${articleID}`, {
        headers,
      });
      const theData = response.data;
      if (theData) {
        setArticleInfo(theData);
      }
    };
    if (!isLoading) {
      fetchData();
    }
  }, [articleID, isLoading, user]);

  const addUpvote = async () => {
    const authtoken = user && (await user.getIdToken());
    const headers = authtoken ? { authtoken } : {};

    const response = await axios.put(
      `/api/articles/${articleID}/upvotes`,
      null,
      { headers }
    );
    const theData = response.data;

    if (theData) {
      setArticleInfo(theData);
    }
  };

  if (!theArticle) {
    return <NotFoundPage />;
  }

  const { canUpvote } = articleInfo;
  console.log("The Canupvote", canUpvote);

  return (
    <>
      <h1>{theArticle.title}</h1>
      {user ? (
        canUpvote ? (
          <button type="button" onClick={addUpvote}>
            <AiFillLike />
          </button>
        ) : (
          <button type="button">
            <AiFillDislike />
          </button>
        )
      ) : (
        <button type="button">Log in to like</button>
      )}
      <h3>This article has {articleInfo.upvote} upvote(s)</h3>

      {theArticle.content.map((eachContent, index) => (
        <p key={index}>{eachContent}</p>
      ))}

      <AddComment comments={articleInfo.comment} />
      <CommentForm
        onsendArticlesInfo={(theData) => setArticleInfo(theData)}
        articleID={articleID}
      />
    </>
  );
};

export default ArticlePage;
