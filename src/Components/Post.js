import React, { useRef, useEffect } from "react";
import Comments from "./Comments";
import {
  upperCaseFirst,
  randomDate,
  concatFetchedContent,
  generateTopic,
  generateTags,
  generateRandomBackgroundColors,
  getRandomColorForBackgroundColor,
} from "./utilities";
import { Link, useOutletContext, useParams } from "react-router-dom";
import PostSelf from "./PostSelf";

const Post = ({ displayPostSelf }) => {
  const params = useParams();

  // CONTEXT FROM REACT ROUTER
  const {
    mergedState,
    setMergedState,
    fetchStatus,
    windowDimensions,
    currentPost,
    setObservedElements,
    lastFivePosts,
    sortMethod,
  } = useOutletContext();
  // REFS
  const { current: randomDateRef } = useRef(randomDate());
  const { current: concatFetchDataRef } = useRef(
    upperCaseFirst(concatFetchedContent(currentPost.body), true)
  );
  // Number used for displaying comments count
  // then when comment is added, userCommentsLen is there added
  const { current: commentsFetchedLength } = useRef(
    1 + Math.round(Math.random() * 4)
  );
  const { current: sharesCount } = useRef(1 + Math.round(Math.random() * 19));
  const { current: randomImageRef } = useRef(
    mergedState.dataRandomPicture[
      Math.trunc(Math.random() * mergedState.dataRandomPicture.length)
    ].download_url
  );
  const { current: topicRef } = useRef(generateTopic());
  const { current: tagsRef } = useRef(
    generateTags(topicRef).sort((a, b) => b.length - a.length)
  );
  const { current: randomBackgroundColorRef } = useRef(
    generateRandomBackgroundColors(tagsRef.length)
  );
  const { current: colorsTagsRef } = useRef(
    randomBackgroundColorRef.map((color) =>
      getRandomColorForBackgroundColor(color)
    )
  );

  // textAreaRef CAN'T BE STORED IN mergedState CAUSE OF CIRCULAR STRUCTER
  // JSON.stringify() WILL THROW AN Error
  const textAreaRef = useRef(null);
  const postRef = useRef(null);

  // console.log(mergedState);
  // console.log(mergedState[sortMethod]);
  // console.log(sortMethod);

  // THIS EFFECT RUNS JUST ONCE AND THE VALUES IN THERE
  // ARE BEEING UPDATED ANYWHERE ELSE
  // THIS IS JUST STATE MERGER AND THE STATE IS UPDATED
  // BY SEPERATE LINES OF CODE
  useEffect(() => {
    if (mergedState?.posts) {
      setMergedState((prevState) => {
        return {
          ...prevState,
          [sortMethod]: {
            ...prevState[sortMethod],
            posts: prevState[sortMethod].posts.map((post) => {
              return post.id === currentPost.id
                ? // CONDITION WHICH TELLS THAT WHEN USER GO TO ANOTHER SUPPAGE
                  // AND THE COMPONENT WILL UNMOUNT, CONDITION WILL NO RUN ONCE AGAIN
                  // BUT IT WILL USE THE OLD DATA FIRST CREATED

                  // IF PROP EXIST THEN USE IT ELSE CREATE IT
                  // IF AT LEAST 1 DOES NOT EXITS, THEN CREATE IT
                  post.comments.showComments === undefined
                  ? {
                      ...post,
                      title: upperCaseFirst(post.title, true),
                      body: `${upperCaseFirst(
                        post.body,
                        true
                      )} ${concatFetchDataRef}`,
                      randomDateRef: randomDateRef,
                      randomImageRef: randomImageRef,
                      sharesCount: sharesCount,
                      topic: topicRef,
                      tags: tagsRef,
                      colorsTags: colorsTagsRef,
                      backgroundColorsTags: randomBackgroundColorRef,
                      comments: {
                        ...post.comments,
                        userCommentsLen: 0,
                        commentsFetchedLength: commentsFetchedLength,
                        commentsLength: commentsFetchedLength,
                        showComments: false,
                        doTextAreaFocus: false,
                        beenShown: false,
                      },
                    }
                  : {
                      ...post,
                      comments: {
                        ...post.comments,
                        showComments: false,
                      },
                    }
                : post;
            }),
          },
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMethod]);

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
      [sortMethod]: {
        ...prevState[sortMethod],
        posts: prevState[sortMethod].posts.map((post) =>
          post.id === currentPost.id
            ? {
                ...post,
                comments: {
                  ...post.comments,
                  showComments: !post.comments.showComments,
                  beenShown: true,
                  doTextAreaFocus: false,
                },
              }
            : post
        ),
      },
    }));

    // LOSE FOCUS ON BUTTON CLICK
    if (textAreaRef.current) {
      textAreaRef.current.blur();
    }
  };

  const handleAddCommentButton = () => {
    // SHOW COMMENTS ON CLICK
    setMergedState((prevState) => ({
      ...prevState,
      [sortMethod]: {
        ...prevState[sortMethod],
        posts: prevState[sortMethod].posts.map((post) =>
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
      },
    }));

    // AUTOFOCUS ON TEXTAREA FIELD
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const handleLikePost = () => {
    setMergedState((prevState) => {
      return {
        ...prevState,
        [sortMethod]: {
          ...prevState[sortMethod],
          posts: prevState[sortMethod].posts.map((post) => {
            return currentPost.id === post.id
              ? { ...post, likes: post.likes + 1 }
              : post;
          }),
        },
      };
    });
  };

  // ON ADMIN
  const handleDeletePost = () => {
    setMergedState((prevState) => {
      return {
        ...prevState,
        [sortMethod]: {
          ...prevState[sortMethod],
          posts: prevState[sortMethod].posts.filter(
            (post) => post.id !== currentPost.id && post
          ),
          dataUsers: prevState[sortMethod].dataUsers.filter(
            (user) => user.id !== currentPost.user.id && user
          ),
        },
      };
    });
  };

  // CLEARS showComments WHEN COMPONENT UNMOUNTS
  // E.G. USER ARE NAVIGATING TO DIFFERENT POST FROM
  // THE PATH ON PostOnPostsPath
  useEffect(() => {
    return () => {
      setMergedState((prevState) => ({
        ...prevState,
        [sortMethod]: {
          ...prevState[sortMethod],
          posts: prevState[sortMethod]?.posts.map((post) =>
            post.id === currentPost.id
              ? { ...post, comments: { ...post.comments, showComments: false } }
              : post
          ),
        },
      }));
    };
  }, [currentPost.id, setMergedState, sortMethod]);

  useEffect(() => {
    if (lastFivePosts?.filter((post) => post.id === currentPost.id).length) {
      setObservedElements((prevState) =>
        prevState.length >= 5
          ? [...new Set([...prevState, postRef])].slice(-5)
          : [...new Set([...prevState, postRef])]
      );
    }
  }, [
    currentPost.id,
    lastFivePosts,
    mergedState.posts.length,
    setObservedElements,
    sortMethod,
  ]);

  // console.log(postRef)
  // console.log(lastFivePosts);

  const PostOnPostsPath = mergedState && fetchStatus && (
    <div
      className="post"
      ref={postRef}
      style={{ display: params.postId ? "none" : "flex" }}
    >
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
            <div className="post-delete-container post-button-container">
              <button
                onClick={handleDeletePost}
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
      <div className="post-title-content-container">
        <div className="post-title">
          <Link to={currentPost.id} className="post-title-link">
            <h3>{currentPost.title}</h3>
          </Link>
        </div>
        <div className="post-content">
          <p>{currentPost.body}</p>
        </div>
      </div>
      <div className="post-interactions-counts-buttons-container">
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
              <div className="post-share-count">{currentPost.sharesCount}</div>
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
            <div className="post-comments-share-container">
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
      </div>
      {currentPost.comments.beenShown && (
        <Comments
          currentPost={currentPost}
          currentPostID={currentPost.postID}
          mergedState={mergedState}
          sortMethod={sortMethod}
          setMergedState={setMergedState}
          showComments={currentPost.comments.showComments}
          doTextAreaFocus={currentPost.comments.doTextAreaFocus}
          commentsFetchedLength={currentPost.comments.commentsFetchedLength}
          windowDimensions={windowDimensions}
          textAreaRef={textAreaRef}
        />
      )}
    </div>
  );

  return params.postId ? (
    <PostSelf
      currentPost={currentPost}
      handleShowCommentsButton={handleShowCommentsButton}
      handleLikePost={handleLikePost}
      handleAddCommentButton={handleAddCommentButton}
      mergedState={mergedState}
      sortMethod={sortMethod}
      textAreaRef={textAreaRef}
      setMergedState={setMergedState}
      params={params}
    />
  ) : (
    PostOnPostsPath
  );
};

export default Post;
