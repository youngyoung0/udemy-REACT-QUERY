import { useState } from "react";
import { useQuery } from "react-query";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0"
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  console.log(fetchPosts);
  const { data, isError, error, isLoading } = useQuery("posts", fetchPosts);
  if (isLoading) return <h3>Loading...</h3>;
  /* isFetching / isLoading
  isFetching : 
    비동키 쿼리가 해결되지 않았음을 의미한다.
    쿼리가 Axios 호출 또는 GraphQL호출일 수도 있다.
  isLoading:
    캐시된 데이터가 없고 가져오는 중입니다.
    쿼리 함수가 아직 해결되지 않은 것 그리고 캐싱된 데이터가 없다.
  */
  if (isError)
    return (
      <>
        <h3>Oops, something wnet wrong</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => { }}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => { }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
