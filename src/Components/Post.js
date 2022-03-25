import React, { useRef, useEffect } from "react";
import Comments from "./Comments";
import {
  upperCaseFirst,
  randomDate,
  concatFetchedContent,
} from "./_parsingFunctions";
import { Link, useOutletContext } from "react-router-dom";

const Post = ({
  randomUser,
  fetchStatus,
  setMergedState,
  observer,
  currentPost,
}) => {
  // CONTEXT
  const [mergedState, windowDimensions] = useOutletContext();

  // REFS
  const randomDateRef = useRef(randomDate());
  const concatFetchDataRef = useRef(
    upperCaseFirst(concatFetchedContent(currentPost.body), true)
  );

  // Number used for displaying comments count
  // then when comments is added, commentsCounter is there added
  const randomNumberRef = useRef(1 + Math.round(Math.random() * 4));
  const sharesCount = useRef(1 + Math.round(Math.random() * 19));
  const randomImageRef = useRef(
    mergedState.dataRandomPicture[
      Math.trunc(Math.random() * mergedState.dataRandomPicture.length)
    ].download_url
  );
  const textAreaRef = useRef(null);

  const handleShowCommentsButton = () => {
    /* IF USER CLICKS THE BUTTON SHOWCOMMENTS AND BEENSHOWN ARE SET TO TRUE ->
      THEN ON THE NEXT CLICK, SHOWCOMMENTS ARE BEENING SET TO FALSE WHILE ->
      BEENSHOWN STATE VARIABLE ARE PERSISTED TO BE TRUE ON EVERY CLICK
      THEN SHOWCOMMENTS ARE BEEING USED TO TOGGLING THE CLASS ->
      WITH DISPLAY PROP ON THE CONTAINER ->
      SO THE COMPONENT IS BEEING PROPERLY TOGGLED ->
      SO THAT RANDOMUSER FETCH CALL ARE TRIGERED ONCE AND THE RESULTS ARE PERSISTED ->
      BETWEEN RENDERS;
    */

    setMergedState((prevState) => ({
      ...prevState,
      posts: prevState.posts.map((post) => ({
        ...post,
        comments: {
          ...post.comments,
          showComments: !post.comments.showComments,
          beenShown: true,
          doTextAreaFocus: false,
        },
      })),
    }));

    // LOSE FOCUS ON BUTTON CLICK
    if (currentPost.comments.textAreaRef.current) {
      currentPost.comments.textAreaRef.current.blur();
    }
  };

  const handleAddCommentButton = () => {
    // SHOW COMMENTS ON CLICK
    setMergedState((prevState) => ({
      ...prevState,
      posts: prevState.posts.map((post) =>
        post.id === currentPost.id
          ? {
              ...post,
              comments: {
                ...post.comments,
                showComments: true,
                beenShown: true,
                doTextAreaFocus: true,
              },
            }
          : post
      ),
    }));
    // AUTOFOCUS ON TEXTAREA FIELD
    if (currentPost.comments.textAreaRef.current) {
      currentPost.comments.textAreaRef.current.focus();
    }
  };

  const handleLikePost = () => {
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.map((post) => {
          return currentPost.id === post.id
            ? { ...post, likes: post.likes + 1 }
            : post;
        }),
      };
    });
  };

  // ON ADMIN
  const deletePost = () => {
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.filter((post) => {
          return post.id !== currentPost.id && post;
        }),
        dataRandomUser: prevState.dataRandomUser.filter((user) => {
          return user.id !== randomUser.id && user;
        }),
      };
    });
  };

  useEffect(() => {
    if (mergedState && mergedState.posts) {
      setMergedState((prevState) => {
        return {
          ...prevState,
          posts: prevState.posts.map((post) => {
            return post.id === currentPost.id
              ? // IF PROP EXIST THEN USE IT ELSE CREATE IT
                post.comments.showComments === undefined
                ? {
                    ...post,
                    body: `${upperCaseFirst(post.body, true)} ${
                      concatFetchDataRef.current
                    }`,
                    randomDateRef: randomDateRef.current,
                    randomImageRef: randomImageRef.current,
                    sharesCount: sharesCount.current,
                    comments: {
                      ...post.comments,
                      commentsCounter: 0,
                      commentsLength: 0 + randomNumberRef.current,
                      textAreaRef: textAreaRef,
                      showComments: false,
                      doTextAreaFocus: false,
                      beenShown: false,
                      randomNumberRef: randomNumberRef.current,
                    },
                  }
                : {
                    ...post,
                    body: post.body,
                    randomDateRef: post.randomDateRef,
                    sharesCount: post.sharesCount,
                    randomImageRef: post.randomImageRef,
                    comments: {
                      ...post.comments,
                      commentsCounter: post.comments.commentsCounter,
                      commentsLength: post.comments.commentsLength,
                      textAreaRef: post.comments.textAreaRef,
                      showComments: post.comments.showComments,
                      doTextAreaFocus: post.comments.doTextAreaFocus,
                      beenShown: post.comments.beenShown,
                      randomNumberRef: post.comments.randomNumberRef,
                      // dataCommnets: false ? true : false,
                    },
                  }
              : post;
          }),
        };
      });
    }
  }, []);

  const commentsDynamicStyles = {
    maxWidth:
      windowDimensions.width <= 937
        ? "863px"
        : windowDimensions.width > 937
        ? "900px"
        : windowDimensions.width <= 900 && windowDimensions.width > 700
        ? `${windowDimensions.width - 47}px` // 900 - 701 viewport
        : `${windowDimensions.width - 27}px`, // >=700 viewport
  };

  return (
    <>
      {mergedState && fetchStatus && (
        <div className="post" style={commentsDynamicStyles} ref={observer}>
          <div className="post-user">
            <div className="post-user-img">
              <img src={randomUser.picture.thumbnail} alt="user thumbnail" />
            </div>
            <div className="post-user-name-date-container">
              <div className="post-user-name-date">
                <div className="post-user-name post-user-label">
                  {`${randomUser.name.first} ${randomUser.name.last}`}
                </div>
                <div className="post-user-date post-user-label">
                  {currentPost.randomDateRef}
                </div>
              </div>

              <div className="post-edit-delete-button">
                <div className="post-delete-container post-button-container">
                  <button
                    onClick={deletePost}
                    className="post-delete-button post-button"
                  >
                    Delete
                  </button>
                </div>
                <div className="post-edit-container post-button-container">
                  <button className="post-edit-button post-button">Edit</button>
                </div>
              </div>
            </div>
          </div>
          <div className="post-image-splash">
            <img src={currentPost.randomImageRef} alt="splash" />
          </div>
          <div className="post-title">
            <Link to={currentPost.id}>
              <h3>{upperCaseFirst(currentPost.title)}</h3>
            </Link>
          </div>
          <div className="post-content">
            <p>{currentPost.body}</p>
          </div>
          <div className="post-likes-comments-share-count noselect">
            <div className="post-likes-count-container post-interaction-count">
              Likes
              <div className="post-likes-count">{currentPost.likes}</div>
            </div>
            <div className="post-comments-shares-container">
              <div
                className="post-comments-count-container post-interaction-count"
                onClick={handleShowCommentsButton}
              >
                Comments
                <div className="post-comments-count">
                  {currentPost.comments.commentsLength}
                </div>
              </div>
              <div className="post-share-count-container post-interaction-count">
                Shares
                <div className="post-share-count">
                  {currentPost.sharesCount}
                </div>
              </div>
            </div>
          </div>
          <div className="post-likes-comments-share-buttons noselect">
            <div className="post-likes-comments-share-buttons-inner-container">
              <div className="post-likes-container">
                <button
                  className="post-likes post-interaction-button"
                  onClick={handleLikePost}
                >
                  Like it!
                </button>
              </div>
              <div className="post-show-comments">
                <button
                  className="post-show-comments-button post-interaction-button "
                  onClick={handleAddCommentButton}
                >
                  Add Comment
                </button>
              </div>
              <div className="post-share">
                <button className="post-share-button post-interaction-button ">
                  Share
                </button>
              </div>
            </div>
          </div>
          {currentPost.comments.beenShown && (
            <Comments
              currentPost={currentPost}
              currentPostID={currentPost.postID}
              mergedState={mergedState}
              setMergedState={setMergedState}
              showComments={currentPost.comments.showComments}
              doTextAreaFocus={currentPost.comments.doTextAreaFocus}
              randomNumberRef={currentPost.comments.randomNumberRef}
              textAreaRef={currentPost.comments.textAreaRef}
              windowDimensions={windowDimensions}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Post;
