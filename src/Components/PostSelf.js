import Comments from "./Comments";

const PostSelf = ({
  currentPost,
  handleShowCommentsButton,
  handleLikePost,
  handleAddCommentButton,
  mergedState,
  sortMethod,
  textAreaRef,
  setMergedState,
}) => {
  return (
    <div className="post" style={{ margin: "0" }}>
      <div className="post-user" style={{ display: "none" }}>
        <div className="post-user-img">
          <img src={currentPost.user.picture.thumbnail} alt="user thumbnail" />
        </div>
        <div className="post-user-name-date-container">
          <div className="post-user-name-date">
            <div className="post-user-name post-user-label">
              {currentPost.user.name.fullName}
            </div>
            <div className="post-user-date post-user-label">
              {currentPost.randomDateRef}
            </div>
          </div>
          <div className="post-edit-delete-button noselect">
            <div className="post-edit-container post-button-container">
              <button className="post-edit-button post-button">Edit</button>
            </div>
          </div>
        </div>
      </div>
      <div className="post-image-splash">
        <img src={currentPost.randomImageRef} alt="splash" />
      </div>
      <div className="post-items-container">
        <div className="post-title-content-container">
          <div className="post-title">
            <h3>{currentPost.title}</h3>
          </div>
          <div className="post-content">
            <p>{currentPost.body}</p>
          </div>
        </div>
        <div className="post-interactions-container">
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
        </div>
        {currentPost.comments.beenShown && (
          <Comments
            currentPost={currentPost}
            sortMethod={sortMethod}
            currentPostID={currentPost.postID}
            mergedState={mergedState}
            setMergedState={setMergedState}
            showComments={currentPost.comments.showComments}
            doTextAreaFocus={currentPost.comments.doTextAreaFocus}
            commentsFetchedLength={currentPost.comments.commentsFetchedLength}
            textAreaRef={textAreaRef}
          />
        )}
      </div>
    </div>
  );
};

export default PostSelf;
