import React, { useEffect } from "react";
import Post from "./Post";
import { useNavigate, useOutletContext } from "react-router-dom";

const Posts = () => {
  const [
    mergedState,
    setMergedState,
    fetchStatus,
    loadingPosts,
    loadingRandomUser,
    observer,
    lastElement,
  ] = useOutletContext();

  let navigate = useNavigate();

  useEffect(() => {
    navigate("/posts");
  }, []);

  return (
    <div className="posts-container">
      <div className="posts">
        {!fetchStatus || !mergedState || !lastElement
          ? "Loading..."
          : // dataPosts as State
            mergedState.posts.map((post, i) => {
              return post.id === lastElement.id ? (
                <Post
                  observer={observer}
                  key={post.id}
                  currentPost={post}
                  randomUser={mergedState.dataRandomUser[i]}
                  setMergedState={setMergedState}
                  mergedState={mergedState}
                  fetchStatus={fetchStatus}
                />
              ) : (
                <Post
                  key={post.id}
                  currentPost={post}
                  randomUser={mergedState.dataRandomUser[i]}
                  setMergedState={setMergedState}
                  mergedState={mergedState}
                  fetchStatus={fetchStatus}
                />
              );
            })}
        {fetchStatus && (!loadingPosts || !loadingRandomUser) && (
          <div className="await">Fetching Data...</div>
        )}
      </div>
    </div>
  );
};

export default Posts;
