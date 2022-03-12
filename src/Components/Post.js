import React, { useState, useRef } from "react";
import Comments from "./Comments";
import {
  upperCaseFirst,
  randomDate,
  concatFetchedContent,
} from "./_parsingFunctions";
import useWindowDimensions from "./Hooks/useWindowDimensions";

const Post = ({
  post,
  randomUser,
  loadingRandomUser,
  loadingRandomPicture,
  setMergedState,
  mergedState,
}) => {
  // STATES
  const [showComments, setShowComments] = useState(false);
  const [beenShown, setBeenShown] = useState(false);
  const [commentsCounter, setCommentsCounter] = useState(0);

  // REFS
  const randomDateRef = useRef(randomDate());
  const concatFetchDataRef = useRef(
    upperCaseFirst(concatFetchedContent(post.body), true)
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
  const { isRead, likes } = post;

  const handleShowComments = () => {
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

  const handleAddComment = () => {
    // SHOW COMMENTS ON CLICK
    setShowComments(true);
    setBeenShown(true);
    setDoTextAreaFocus(true);
    // AUTOFOCUS ON TEXTAREA FIELD
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const handleLikePost = (id) => {
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.map((post) => {
          return id === post.id ? { ...post, likes: post.likes + 1 } : post;
        }),
      };
    });
  };

  // ON ADMIN
  const deletePost = (id) => {
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.filter((post) => {
          return post.id !== id && post;
        }),
      };
    });
  };

  const windowDimensions = useWindowDimensions();

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
      {!loadingRandomUser && !loadingRandomPicture && (
        <div className="post" style={commentsDynamicStyles}>
          <div className="post-user">
            <div className="post-user-img">
              <img src={randomUser.picture.thumbnail} alt="user thumbnail" />
            </div>
            <div className="post-user-name-date">
              <div className="post-user-name">
                {`${randomUser.name.first} ${randomUser.name.last}`}
                <div className="post-delete-container">
                  <button
                    onClick={() => deletePost(post.id)}
                    className="post-delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="post-user-date">{randomDateRef.current}</div>
            </div>
          </div>
          <div className="post-image-splash">
            <img src={randomImageRef.current} alt="splash" width="900" />
          </div>
          <div className="post-title">
            <h3>{upperCaseFirst(post.title)}</h3>
          </div>
          <div className="post-content">
            <p>
              {upperCaseFirst(post.body, true)} {concatFetchDataRef.current}
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
                onClick={handleShowComments}
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
                  onClick={() => handleLikePost(post.id)}
                >
                  Like it!
                </button>
              </div>
              <div className="post-show-comments">
                <button
                  className="post-show-comments-button post-interaction-button "
                  onClick={handleAddComment}
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
              postID={post.id}
              post={post}
              mergedState={mergedState}
              setMergedState={setMergedState}
              showComments={showComments}
              setShowComments={setShowComments}
              setCommentsCounter={setCommentsCounter}
              doTextAreaFocus={doTextAreaFocus}
              setDoTextAreaFocus={setDoTextAreaFocus}
              randomNumberRef={randomNumberRef.current}
              textAreaRef={textAreaRef}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Post;
