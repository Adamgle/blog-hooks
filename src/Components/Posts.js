import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import {
  useOutletContext,
  Outlet,
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";
import InteractionsData from "./IneractionsData";

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
  const navigate = useNavigate();

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
  // console.log(mergedState?.posts.forEach((post) => console.log(post.postID)));

  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    if (mergedState && fetchStatus) {
      setCurrentPost(
        () => mergedState?.posts.filter((post) => post.id === params.postId)[0]
      );
    }
  }, [mergedState, fetchStatus, params.postId]);

  useEffect(() => {
    if (mergedState && fetchStatus) {
      const postsIds = mergedState.posts.map((post) => post.id);
      if (
        params.mountParams === "blog-hooks" &&
        !postsIds.includes(params.postId)
      ) {
        navigate("/blog-hooks/posts");
      }
    }
  }, [fetchStatus, mergedState, navigate, params.mountParams, params.postId]);

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
                  <div className="post-self-author-image-about-container">
                    <img src={currentPost.user.picture.medium} alt="author" />
                    <h5>ABOUT</h5>
                  </div>
                  <div className="post-self-author-info">
                    <p>{currentPost.user.name.fullName}</p>
                    <p>{currentPost.user.email}</p>
                  </div>
                </div>
                <div className="post-self-author-about">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint
                  suscipit atque dolores illum aspernatur recusandae.
                </div>
              </div>
              <div className="post-self-user-posts-container">
                <h4>{currentPost.user.name.first} Posts</h4>
                <div className="post-self-user-posts">
                  <div className="post-self-user-post-container">
                    {mergedState.posts
                      .filter((post) => post.user.name.fullName === currentPost.user.name.fullName)
                      .map((post) => (
                        <div className="post-self-user-post" key={nanoid()}>
                          <div className="post-self-user-post-img-container">
                            <Link to={`/blog-hooks/posts/${post.id}`}>
                              <img
                                src={post.randomImageRef}
                                alt="hero"
                                className="post-self-user-post-img"
                              />
                            </Link>
                          </div>
                          <div className="post-self-user-title-interactions-wrapper">
                            <Link
                              to={`/blog-hooks/posts/${post.id}`}
                              style={{ textDecoration: "none", color: "#fff" }}
                            >
                              <div className="post-self-user-post-title">
                                {post.title}
                              </div>
                            </Link>
                            <InteractionsData
                              currentPost={post}
                              comments={true}
                              likes={true}
                              containerStyle={{
                                justifyContent: "flex-start",
                                fontWeight: "400",
                                fontSize: "12px",
                                gap: ".75rem"
                              }}
                              itemStyle={{ cursor: "auto" }}
                            />
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
                        backgroundColor: currentPost.backgroundColorsTags[i],
                        color: currentPost.colorsTags[i],
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
