import React, { useState, useRef, useEffect } from "react";
import { Comments } from "./Comments";
import { useFetch } from "./useFetch";
import {
  upperCaseFirst,
  randomDate,
  concatFetchedContent,
} from "./_parsingFunctions";

const Posts = () => {
  // STATE
  const [usersCount, setUsersCount] = useState(2);
  const [mergedState, setMergedState] = useState(null);
  // DB'S
  const dbUsers = `https://jsonplaceholder.typicode.com/posts/?_limit=${usersCount}`;
  const dbRandomUser = `https://randomuser.me/api/?results=${usersCount}&noinfo`;
  const dbRandomPicture = `https://picsum.photos/v2/list?page=2&limit=100`;
  console.log(mergedState);
  // FETCH CALLS
  const { data: dataPosts, loading: loadingPosts } = useFetch(dbUsers);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);
  const { data: dataRandomPicture, loading: loadingRandomPicture } =
    useFetch(dbRandomPicture);

  useEffect(() => {
    if (!loadingPosts && !loadingRandomUser && !loadingRandomPicture) {
      setMergedState({
        posts: dataPosts.map((post) => ({
          ...post,
          comments: {},
          likes: 0,
          isRead: false,
        })),
        dataRandomUser: dataRandomUser.results,
        dataRandomPicture: dataRandomPicture,
        dataProfile: {
          name: "Adam",
          image:
            "https://brokeinlondon.com/wp-content/uploads/2012/01/Facebook-no-profile-picture-icon-620x389.jpg",
        },
      });
    }
  }, [loadingPosts, loadingRandomUser, loadingRandomPicture]);

  return (
    <div className="posts-container">
      <div className="posts">
        {loadingPosts ||
        loadingRandomUser ||
        loadingRandomPicture ||
        !mergedState
          ? "Loading..."
          : // dataPosts as State
            mergedState.posts.map((post, i) => (
              <Post
                key={post.id}
                post={post}
                randomUser={mergedState.dataRandomUser[post.id - 1]}
                loadingRandomUser={loadingRandomUser}
                loadingRandomPicture={loadingRandomPicture}
                setMergedState={setMergedState}
                mergedState={mergedState}
              />
            ))}
      </div>
    </div>
  );
};
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
  };

  const handleAddComment = () => {
    // SHOW COMMENTS ON CLICK
    setShowComments(true);
    setBeenShown(true);
    // THEN AUTOFOCUS ON INPUT FIELD
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

  return (
    <>
      {!loadingRandomUser && !loadingRandomPicture && (
        <div className="post">
          <div className="post-user">
            <div className="post-user-img">
              <img src={randomUser.picture.thumbnail} alt="user thumbnail" />
            </div>
            <div className="post-user-name-date">
              <div className="post-user-name">{`${randomUser.name.first} ${randomUser.name.last}`}</div>
              <div className="post-user-date">{randomDateRef.current}</div>
            </div>
            <div>
              <button onClick={() => deletePost(post.id)}>DELETE</button>
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
                  {randomNumberRef.current}
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
              showComments={showComments}
              setShowComments={setShowComments}
              randomNumberRef={randomNumberRef.current}
              mergedState={mergedState}
              setMergedState={setMergedState}
            />
          )}
        </div>
      )}
    </>
  );
};

export { Posts, Post, upperCaseFirst };
