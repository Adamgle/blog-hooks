import Comments from "./Comments";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import InteractionsData from "./IneractionsData";
import { useRef } from "react";

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
  const { current: splashImageUrl } = useRef(
    currentPost.randomImageRef
      .split("/")
      .slice(0, currentPost.randomImageRef.split("/").length - 2)
      .join("/") + "/800/400"
  );

  return (
    <div className="post-self-container">
      <div className="post-self-author-container">
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
                .filter(
                  (post) =>
                    post.user.name.fullName === currentPost.user.name.fullName
                )
                .map((post) => (
                  <div className="post-self-user-post" key={nanoid()}>
                    <div className="post-self-user-post-img-container">
                      <Link to={`/blog-hooks/posts/${post.id}`}>
                        <img
                          src={
                            post.randomImageRef
                              .split("/")
                              .slice(
                                0,
                                currentPost.randomImageRef.split("/").length - 2
                              )
                              .join("/") + "/328/160"
                          }
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
                          gap: ".75rem",
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
      <div className="post-self">
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
          <img
            src={splashImageUrl}
            alt="splash"
            className="post-image-splash-img"
          />
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
                <div className="post-comments-shares-container">
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
                commentsFetchedLength={
                  currentPost.comments.commentsFetchedLength
                }
                textAreaRef={textAreaRef}
              />
            )}
          </div>
        </div>
      </div>
      <div className="post-self-recent-posts">recent-posts</div>
    </div>
  );
};

export default PostSelf;
