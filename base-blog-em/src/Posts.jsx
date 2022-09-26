import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  console.log(pageNum);
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}"
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if(currentPage < maxPostPage){
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage));
    }
  },[currentPage, queryClient]);

  const { data, isError, error, isLoading } =
    useQuery(["posts", currentPage], () => fetchPosts(currentPage), { staleTime: 2000, keepPreviousData: true });
  /**
   * stale time / cache time
   * stale time
   *  데이터 만료됐다고 판단하기 전까지 허용하는 시간
   *  리페칭할때 고려 사항
   * 
   * cache time
   *  나중에 다시 필요할 수도 있는 데이터
   *  해당 데이터는 콜드 스토리지로 이동 구성된 cache time이 지나면 캐시의 데이터가 만료 되어 유효시간이 기본값 5분입니다. 
   */
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
        <button
          disabled={currentPage <= 1}
          onClick={() => { setCurrentPage((previousValue) => previousValue - 1) }}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => { setCurrentPage((previousValue) => previousValue + 1) }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
