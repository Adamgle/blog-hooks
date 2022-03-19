import React, { useEffect } from "react";
import { useFetch } from "./Hooks/useFetch";
import { nanoid } from "nanoid";
import Comment from "./Comment";
import AddCommentField from "./AddCommentField";

const Comments = ({
  currentPost,
  currentPostID,
  mergedState,
  randomNumberRef,
  showComments,
  setMergedState,
  setCommentsCounter,
  doTextAreaFocus,
  textAreaRef,
  setDoTextAreaFocus,
  windowDimensions,
}) => {
  const dbComments = `https://jsonplaceholder.typicode.com/posts/${currentPostID}/comments/?_limit=${randomNumberRef}`;
  const dbRandomUser = `https://randomuser.me/api/?results=${randomNumberRef}&noinfo`;

  const { data: dataComments, loading: loadingComments } = useFetch(dbComments);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);

  // CREATE COMMENTS DATA ON MOUNT WITH CONSIDERATION ON FETCH CALLS
  useEffect(() => {
    if (!loadingComments && !loadingRandomUser) {
      setMergedState((prevState) => {
        return {
          ...prevState,
          posts: prevState.posts.map((post) => {
            if (post.id === currentPost.id) {
              post.comments = {
                dataComments: dataComments.map((comment, i) => ({
                  ...comment,
                  id: nanoid(),
                  picture: dataRandomUser.results[i].picture.thumbnail,
                  likes: 0,
                  replies: 0,
                })),
                dataRandomUser: dataRandomUser.results,
                textField: "",
              };
            }
            return post;
          }),
        };
      });
    }
  }, [
    currentPost.id,
    setMergedState,
    dataComments,
    dataRandomUser,
    loadingComments,
    loadingRandomUser,
  ]);

  // COMPUTE CURRENT VIEWPORT
  // IF USER PASS A LOT OF TEXT IN ONE WORD "LONG STRING WITHOUT WHITE CHARACTER"
  // -> IN TEXTFIELD THEN APPLICATION UI WILL BROKE ->
  // THIS STATEMENT HANDLES THAT THE CONTAINER WILL FIT TO VIEWPORT ->
  // WITH CONSIDERATION ON PADDING, MARGINS AND BORDERS SO THAT ->
  // TEXT WILL FIT TO CONTAINER CAUSING WORD WRAP "OR LETTERS WRAP"
  const commentsDynamicStyles = {
    maxWidth:
      windowDimensions.width > 900
        ? "863px"
        : windowDimensions.width <= 900 && windowDimensions.width > 700
        ? `${windowDimensions.width - 77}px` // 900 - 701 viewport
        : `${windowDimensions.width - 67}px`, // >=700 viewport
  };

  return (
    <div
      className={`comments-container ${!showComments ? "hidden" : ""}`}
      style={commentsDynamicStyles}
    >
      <div className="comments-label">Comments</div>
      {loadingComments ||
      loadingRandomUser ||
      !currentPost.comments.dataComments ? (
        // WAIT FOR ALL APIS AND STATE MERGES, THEN DISPLAY DATA
        // IF AT LEAST ONE OF THEM ARE FALSY THEN DISPLAY "LOADING..."
        "Loading..."
      ) : (
        <>
          <AddCommentField
            mergedState={mergedState}
            textAreaRef={textAreaRef}
            currentPost={currentPost}
            doTextAreaFocus={doTextAreaFocus}
            setMergedState={setMergedState}
            setDoTextAreaFocus={setDoTextAreaFocus}
            setCommentsCounter={setCommentsCounter}
          />
          {currentPost.comments.dataComments.map((comment, i) => (
            <Comment
              key={comment.id}
              currentPost={currentPost}
              currentComment={comment}
              mergedState={mergedState}
              randomUser={currentPost.comments.dataRandomUser[i]}
              dataRandomUserLength={dataRandomUser.results.length}
              commentsLength={currentPost.comments.dataComments.length}
              setMergedState={setMergedState}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
