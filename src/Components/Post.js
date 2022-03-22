import React, { useState, useRef } from "react";
import Comments from "./Comments";
import {
  upperCaseFirst,
  randomDate,
  concatFetchedContent,
} from "./_parsingFunctions";

const Post = ({
  currentPost,
  randomUser,
  fetchStatus,
  setMergedState,
  mergedState,
  observer,
  windowDimensions,
}) => {
  // STATES
  const [showComments, setShowComments] = useState(false);
  const [beenShown, setBeenShown] = useState(false);
  const [commentsCounter, setCommentsCounter] = useState(0);
  console.log(currentPost)
  // REFS
  const randomDateRef = useRef(randomDate());
  const concatFetchDataRef = useRef(
    upperCaseFirst(concatFetchedContent(currentPost.body), true)
  );
  const randomNumberRef = useRef(1 + Math.round(Math.random() * 4));
  const sharesCount = useRef(1 + Math.round(Math.random() * 19));
  const randomImageRef = useRef(
    mergedState.dataRandomPicture[
      Math.trunc(Math.random() * mergedState.dataRandomPicture.length)
    ].download_url
  );
  const [doTextAreaFocus, setDoTextAreaFocus] = useState(false);
  const textAreaRef = useRef(null);

  // VARS
  const { isRead, likes } = currentPost;

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
    setShowComments((prevState) => !prevState);
    setBeenShown(true);
    setDoTextAreaFocus(false);
    // LOSE FOCUS ON BUTTON CLICK
    if (textAreaRef.current) {
      textAreaRef.current.blur();
    }
  };

  const handleAddCommentButton = () => {
    // SHOW COMMENTS ON CLICK
    setShowComments(true);
    setBeenShown(true);
    setDoTextAreaFocus(true);
    // AUTOFOCUS ON TEXTAREA FIELD
    if (textAreaRef.current) {
      textAreaRef.current.focus();
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
      {fetchStatus && randomUser && (
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
                  {randomDateRef.current}
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
            <img src={randomImageRef.current} alt="splash" />
          </div>
          <div className="post-title">
            <h3>{upperCaseFirst(currentPost.title)}</h3>
          </div>
          <div className="post-content">
            <p>
              {upperCaseFirst(currentPost.body, true)}
              {concatFetchDataRef.current}
            </p>
          </div>
          <div className="post-likes-comments-share-count noselect">
            <div className="post-likes-count-container post-interaction-count">
              Likes
              <div className="post-likes-count">{likes}</div>
            </div>
            <div className="post-comments-shares-container">
              <div
                className="post-comments-count-container post-interaction-count"
                onClick={handleShowCommentsButton}
              >
                Comments
                <div className="post-comments-count">
                  {randomNumberRef.current + commentsCounter}
                </div>
              </div>
              <div className="post-share-count-container post-interaction-count">
                Shares
                <div className="post-share-count">{sharesCount.current}</div>
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
          {beenShown && (
            <Comments
              currentPost={currentPost}
              currentPostID={currentPost.postID}
              mergedState={mergedState}
              setMergedState={setMergedState}
              showComments={showComments}
              setShowComments={setShowComments}
              setCommentsCounter={setCommentsCounter}
              setDoTextAreaFocus={setDoTextAreaFocus}
              doTextAreaFocus={doTextAreaFocus}
              randomNumberRef={randomNumberRef.current}
              textAreaRef={textAreaRef}
              windowDimensions={windowDimensions}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Post;
