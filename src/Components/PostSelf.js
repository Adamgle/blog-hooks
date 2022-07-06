import Comments from "./Comments";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import InteractionsData from "./IneractionsData";
import { useEffect, useRef, useState } from "react";
import useWindowDimension from "./Hooks/useWindowDimensions";

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
  const observer = useRef(null);
  const [stateObserver, setStateObserver] = useState(null);
  const [intersecting, setIntersecting] = useState(null);
  const [toIndex, setToIndex] = useState(10);
  const [recentPosts, setRecentPosts] = useState([]);

  const dimension = useWindowDimension();
  console.log(dimension);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setToIndex((prevState) => (intersecting ? prevState + 5 : prevState));
  }, [intersecting, stateObserver]);

  useEffect(() => {
    if (mergedState.posts.length) {
      setRecentPosts(mergedState.posts.slice(0, toIndex));
    }
  }, [mergedState, toIndex]);
  useEffect(() => {
    if (recentPosts.length && stateObserver) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      };
      const createdObserver = new IntersectionObserver(
        (entries, observerThis) => {
          if (recentPosts.length === mergedState.posts.length) {
            entries.forEach((e) => observerThis.unobserve(e.target));
            observerThis.disconnect();
            return;
          }
          const [post] = entries;

          setIntersecting(post.isIntersecting);

          if (post.target && post.isIntersecting) {
            createdObserver.unobserve(post.target);
            createdObserver.disconnect();
          }
        },
        options
      );
      if (stateObserver && observer.current) {
        createdObserver.observe(observer.current);
      }
      return () => {
        createdObserver.disconnect();
      };
    }
  });

  return (
    <div className="post-self-container">
      {dimension.width >= 1800 && (
        <PostSelfAuthor currentPost={currentPost} mergedState={mergedState} />
      )}
      <PostSelfContent
        currentPost={currentPost}
        handleLikePost={handleLikePost}
        splashImageUrl={splashImageUrl}
        handleShowCommentsButton={handleShowCommentsButton}
        handleAddCommentButton={handleAddCommentButton}
        comments={
          currentPost.comments.beenShown && (
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
          )
        }
      />
      {dimension.width <= 1080 && (
        <div className="post-self-author-recent-posts-container">
          <PostSelfAuthor currentPost={currentPost} mergedState={mergedState} />
          <PostSelfObserver
            currentPost={currentPost}
            setStateObserver={setStateObserver}
            recentPosts={recentPosts}
            observer={observer}
          />
        </div>
      )}
      {dimension.width >= 1800 || dimension.width > 1080 && (
        <PostSelfObserver
          currentPost={currentPost}
          setStateObserver={setStateObserver}
          recentPosts={recentPosts}
          observer={observer}
        />
      )}
      {/* <PostSelfObserver
        currentPost={currentPost}
        setStateObserver={setStateObserver}
        recentPosts={recentPosts}
        observer={observer}
      /> */}
    </div>
  );
};

const PostSelfAuthor = ({ currentPost, mergedState }) => {
  return (
    <div className="post-self-author-container">
      <div className="post-self-author">
        <div className="post-self-author-inner-container">
          <div className="post-self-author-image-about-container">
            <img src={currentPost.user.picture.medium} alt="author" />
            <h3>ABOUT</h3>
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
        <h3>{currentPost.user.name.first} Posts</h3>
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
        <h3>TAGS</h3>
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
  );
};

const PostSelfContent = ({
  currentPost,
  handleLikePost,
  splashImageUrl,
  handleShowCommentsButton,
  handleAddCommentButton,
  comments,
}) => {
  return (
    <div className="post-self">
      <div className="post-user">
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
        <img
          src={splashImageUrl}
          alt="splash"
          className="post-image-splash-img"
        />
      </div>
      <div className="post-items-container">
        <div className="post-title-content-container">
          <div className="post-title">
            <h2>{currentPost.title}</h2>
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
          {comments}
        </div>
      </div>
    </div>
  );
};

const PostSelfObserver = ({
  currentPost,
  setStateObserver,
  recentPosts,
  observer,
}) => {
  return (
    <div className="post-self-recent-posts">
      <h4>RECENT POSTS</h4>
      {recentPosts &&
        recentPosts.map((post) => (
          <PostSelfRecent
            key={post.id}
            post={post}
            currentPost={currentPost}
            observer={observer}
            recentPosts={recentPosts}
            setStateObserver={setStateObserver}
          />
        ))}
    </div>
  );
};

const PostSelfRecent = ({
  observer,
  post,
  currentPost,
  setStateObserver,
  recentPosts,
}) => {
  const isLastPost = recentPosts.at(-1).id === post.id;

  useEffect(() => {
    if (observer.current && isLastPost) {
      setStateObserver(observer.current);
    }
  }, [isLastPost, observer, setStateObserver]);
  return (
    <div className="post-self-user-post" key={nanoid()} ref={observer}>
      <div className="post-self-user-post-img-container">
        <Link to={`/blog-hooks/posts/${post.id}`}>
          <img
            src={
              post.randomImageRef
                .split("/")
                .slice(0, currentPost.randomImageRef.split("/").length - 2)
                .join("/") + "/168/94"
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
            <h5>
              {post.title.length > 30
                ? [...post.title].slice(0, 30).join("") + "..."
                : post.title}
            </h5>
          </div>
        </Link>
        <div className="post-self-user-interactions-date-container">
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
          <div className="post-self-user-date">{post.randomDateRef}</div>
        </div>
      </div>
    </div>
  );
};

export default PostSelf;
