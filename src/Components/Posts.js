import React from "react";
import { useOutletContext, Outlet, useParams } from "react-router-dom";

const Posts = () => {
  const {
    mergedState,
    setMergedState,
    fetchStatus,
    loadingPosts,
    loadingRandomUser,
    observer,
    lastElement,
    windowDimensions,
  } = useOutletContext();

  // GET URL PARAMS
  const params = useParams();

  const displayPosts = (
    <>
      {!localStorage.getItem("mergedState") ||
      !fetchStatus ||
      !mergedState ||
      !lastElement
        ? "Loading..."
        : mergedState.posts.map((post) => {
            return post.id === lastElement.id ? (
              // ADD OBSERVER IF LAST POST ARE BEING INTERATED
              <Outlet
                key={post.id}
                context={{
                  observer,
                  mergedState,
                  setMergedState,
                  fetchStatus,
                  loadingPosts,
                  loadingRandomUser,
                  lastElement,
                  windowDimensions,
                  currentPost: post,
                }}
              />
            ) : (
              <Outlet
                key={post.id}
                context={{
                  mergedState,
                  setMergedState,
                  fetchStatus,
                  loadingPosts,
                  loadingRandomUser,
                  lastElement,
                  windowDimensions,
                  currentPost: post,
                }}
              />
            );
          })}
      {(!loadingPosts || !loadingRandomUser) && (
        <div className="await">{!fetchStatus ? "" : "Fetching Data..."}</div>
      )}
    </>
  );

  const displayPost = mergedState?.posts.map((post) => {
    return post.id === params.postId ? (
      <Outlet
        key={post.id}
        context={{
          mergedState,
          setMergedState,
          fetchStatus,
          loadingPosts,
          loadingRandomUser,
          observer,
          lastElement,
          windowDimensions,
          currentPost: post,
        }}
      />
    ) : null;
  });

  return (
    <div className="posts-container">
      <div className="posts">{params.postId ? displayPost : displayPosts}</div>
    </div>
  );
};

export default Posts;
