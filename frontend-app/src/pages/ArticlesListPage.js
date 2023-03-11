import articles from "./articles-content";

const ArticlesListPage = () => {
  return (
    <>
      <h1>Articles</h1>
      {articles.map((eachArticle, index) => {
        return (
          <div key={index}>
            <h2> {eachArticle.title} </h2>
            <p>
              {" "}
              {eachArticle.content[0].substring(0, 147)}...
              <a href={`/articles/${eachArticle.name}`}>read more</a>{" "}
            </p>
          </div>
        );
      })}
    </>
  );
};

export default ArticlesListPage;
