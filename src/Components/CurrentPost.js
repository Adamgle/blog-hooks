import { useState, useEffect, useRef } from "react";
import { useOutletContext, useParams, Link } from "react-router-dom";
import Comments from "./Comments";
import { upperCaseFirst } from "./_parsingFunctions";

const CurrentPost = () => {
  const [
    mergedState,
    setMergedState,
    fetchStatus,
    ,
    ,
    observer,
    ,
    windowDimensions,
  ] = useOutletContext();
  // const [currentPost, setCurrentPost] = useState(null);

  const params = useParams();

  console.log(params);

  const currentPost = mergedState.posts.find(
    (post) => post.id === params.postId
  );

  console.log(currentPost);

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
          return user.id !== mergedState.currentUser.id && user;
        }),
      };
    });
  };

  console.log(currentPost);

  return (
    <div className="posts-container">
      <div className="posts">
        {mergedState && fetchStatus && (
          // style={commentsDynamicStyles}
          <div className="post" ref={observer}>
            <div className="post-user">
              <div className="post-user-img">
                <img
                  src={currentPost.user.picture.thumbnail}
                  alt="user thumbnail"
                />
              </div>
              <div className="post-user-name-date-container">
                <div className="post-user-name-date">
                  <div className="post-user-name post-user-label">
                    {`${currentPost.user.name.first} ${currentPost.user.name.last}`}
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
                    <button className="post-edit-button post-button">
                      Edit
                    </button>
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
                commentsFetchedLength={
                  currentPost.comments.commentsFetchedLength
                }
                textAreaRef={currentPost.comments.textAreaRef}
                windowDimensions={windowDimensions}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentPost;
