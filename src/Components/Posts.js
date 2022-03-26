import React, { useEffect, useState } from "react";
import Post from "./Post";
import {
  useNavigate,
  useOutletContext,
  Outlet,
  useParams,
} from "react-router-dom";

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

  let navigate = useNavigate();
  const params = useParams();

  console.log(params);

  // useEffect(() => {
  //   navigate("/posts");
  // }, []);

  const displayPosts = () => {
    return (
      <>
        {!fetchStatus || !mergedState || !lastElement
          ? "Loading..."
          : // dataPosts as State
            mergedState.posts.map((post) => {
              return post.id === lastElement.id ? (
                <Outlet
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
                    currentUser: post.user,
                  }}
                />
              ) : (
                <Outlet
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
                    currentUser: post.user,
                  }}
                />
              );
            })}
        {fetchStatus && (!loadingPosts || !loadingRandomUser) && (
          <div className="await">Fetching Data...</div>
        )}
      </>
    );
  };
  return (
    <div className="posts-container">
      <div className="posts">
        {!params.postId
          ? displayPosts()
          : mergedState?.posts.map((post) => {
              return post.postID.toString() === params.postId ? (
                <Outlet
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
                    currentUser: post.user,
                  }}
                />
              ) : null;
            })}
        {/* {displayPosts()} */}
      </div>
    </div>
  );
};

export default Posts;
