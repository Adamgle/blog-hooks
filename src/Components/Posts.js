import { nanoid } from "nanoid";
import React, { useEffect, useState, useRef } from "react";
import { useOutletContext, Outlet, useParams } from "react-router-dom";
import {
  generateRandomColors,
  getRandomBackgroundColor,
} from "./_parsingFunctions";

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
      {!fetchStatus || !mergedState || !lastElement
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
      {fetchStatus && (!loadingPosts || !loadingRandomUser) && (
        <div className="await">Fetching Data...</div>
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

  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    if (mergedState && fetchStatus) {
      setCurrentPost(
        () => mergedState?.posts.filter((post) => post.id === params.postId)[0]
      );
    }
  }, [mergedState, fetchStatus, params.postId]);

  const { current: randomColorRef } = useRef(generateRandomColors(5));

  // console.log(currentPost.likes)

  return (
    <div
      className={`posts-container ${
        params.postId ? "posts-container-self" : ""
      }`}
    >
      <div className="posts">
        {params.postId && currentPost ? (
          <div className="post-self">
            <div className="post-self-about-author">
              <div className="post-self-author">
                <div className="post-self-author-inner-container">
                  <img src={currentPost.user.picture.medium} alt="author" />
                  <div className="post-self-author-info">
                    <p>{currentPost.user.name.fullName}</p>
                    <p>{currentPost.user.email}</p>
                  </div>
                </div>
                <div className="post-self-author-about">
                  <h5>ABOUT</h5>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Error, fugiat.
                </div>
              </div>
              <div className="post-self-user-posts-container">
                <h4>{currentPost.user.name.first} Posts</h4>
                <div className="post-self-user-posts">
                  <div className="post-self-user-post-container">
                    {mergedState.posts
                      .filter((post) => post.postID === currentPost.postID)
                      .map((post) => (
                        <div className="post-self-user-post">
                          <div className="post-self-user-post-img-container">
                            <img
                              src={post.randomImageRef}
                              alt="hero"
                              className="post-self-user-post-img"
                            />
                          </div>
                          <div className="post-self-user-post-title">
                            {post.title}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="post-self-tags-container">
                <h6>TAGS</h6>
                <div className="post-self-tags">
                  {currentPost.tags.map((tag, i) => (
                    <span
                      key={nanoid()}
                      style={{
                        backgroundColor: randomColorRef[i],
                        color: getRandomBackgroundColor(randomColorRef[i]),
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {displayPost}
            <div className="post-self-recent-posts">recent-posts</div>
          </div>
        ) : (
          displayPosts
        )}
      </div>
    </div>
  );
};

export default Posts;
