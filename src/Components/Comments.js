import React, { useEffect } from "react";
import { useFetch } from "./Hooks/useFetch";
import useWindowDimensions from "./Hooks/useWindowDimensions";
import { nanoid } from "nanoid";
import Comment from "./Comment";
import TextAreaAutosizeRef from "./TextAreaAutosizeRef";

const Comments = ({
  postID,
  post,
  mergedState,
  randomNumberRef,
  showComments,
  setMergedState,
  setCommentsCounter,
  doTextAreaFocus,
  textAreaRef,
  setDoTextAreaFocus,
}) => {
  const dbComments = `https://jsonplaceholder.typicode.com/posts/${postID}/comments/?_limit=${randomNumberRef}`;
  const dbRandomUser = `https://randomuser.me/api/?results=${randomNumberRef}&noinfo`;

  const { data: dataComments, loading: loadingComments } = useFetch(dbComments);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);

  useEffect(() => {
    if (!loadingComments && !loadingRandomUser) {
      setMergedState((prevState) => {
        return {
          ...prevState,
          posts: prevState.posts.map((post, i) => {
            if (post.id === postID) {
              post.comments = {
                dataComments: dataComments.map((comment, i) => ({
                  ...comment,
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
  }, [loadingComments, loadingRandomUser]);

  const handleChange = (e) => {
    // SET INPUT TEXT ON STATEFULL VALUE
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.map((post, i) => {
          if (post.id === postID) {
            post.comments = {
              ...post.comments,
              textField: e.target.value,
            };
          }
          return post;
        }),
      };
    });
    //
    setDoTextAreaFocus(true);
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    // ADD COMMENT
    if (post.comments.textField) {
      setMergedState((prevState) => {
        return {
          ...prevState,
          posts: prevState.posts.map((post) => {
            return post.id === id
              ? {
                  ...post,
                  comments: {
                    ...post.comments,
                    dataComments: [
                      {
                        body: post.comments.textField,
                        email: prevState.dataProfile.email,
                        id: nanoid(),
                        name: "",
                        picture: prevState.dataProfile.image,
                        postId: postID,
                        likes: 0,
                        replies: 0,
                      },
                      ...post.comments.dataComments,
                    ],
                  },
                }
              : post;
          }),
        };
      });
      // INCREMENT COMMENTS LENGTH (WHICH IS COMMING FROM POST COMPONENT ->
      // AS STATE SEPARATE VALUE)
      setCommentsCounter((prevState) => prevState + 1);
    }
    // ClEAR TEXTFIELD AFTER SUBMIT
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.map((post, i) => {
          if (post.id === postID) {
            post.comments = {
              ...post.comments,
              textField: "",
            };
          }
          return post;
        }),
      };
    });
    // CLEAR FOCUS AFTER SUBMIT ON TEXTAREA
    setDoTextAreaFocus(false);
  };

  const likeComment = (postID, commentID) => {
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.map((post) => {
          return post.id === postID
            ? {
                ...post,
                comments: {
                  ...post.comments,
                  dataComments: post.comments.dataComments.map((comment) => {
                    return commentID === comment.id
                      ? { ...comment, likes: comment.likes + 1 }
                      : comment;
                  }),
                },
              }
            : post;
        }),
      };
    });
  };

  // MAKE COMMENT SUBMIT HAPPENDS ON ENTER KEY
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event, postID);
      // CLEAR FOCUS AFTER SUBMIT ON TEXTAREA
      setDoTextAreaFocus(false);
    }
  };

  // HOOKS WHICH RETURNS WIDTH AND HEIGHT FOR CURRENT VIEWPORT
  const windowDimensions = useWindowDimensions();

  // COMPUTE CURRENT VIEWPORT
  // IF USER PASS A LOT OF TEXT IN ONE WORD "LONG STRING WITHOUT WHITE CHARACTER"
  // -> IN TEXTFIELD APPLICATION UI WILL BROKE ->
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

  console.log(dataComments);
  console.log(dataRandomUser);
  console.log(loadingComments, loadingRandomUser, post.comments.dataComments);
  return (
    <div
      className={`comments-container ${!showComments ? "hidden" : ""}`}
      style={commentsDynamicStyles}
    >
      <div className="comments-label">Comments</div>
      {/* false false, []*/}
      {loadingComments || loadingRandomUser || !post.comments.dataComments ? (
        // WAIT FOR ALL APIS AND STATE MERGES, THEN DISPLAY DATA
        // IF AT LEAST ONE OF THEM ARE FALSY THEN DISPLAY "LOADING..."
        "Loading..."
      ) : (
        <>
          <div className="comment-profile">
            <img
              className="comment-picture-profile picture-profile"
              src={mergedState.dataProfile.image}
              alt="thumbnail"
            />
            <div className="comment-profile-name">
              <div className="comment-name">{mergedState.dataProfile.name}</div>
              <form
                className="comment-form noselect"
                onKeyDown={(e) => handleKeyPress(e)}
              >
                <TextAreaAutosizeRef
                  ref={textAreaRef}
                  post={post}
                  handleChange={handleChange}
                  doTextAreaFocus={doTextAreaFocus}
                />
                <div className="comment-publish-container">
                  <button
                    onClick={(e) => handleSubmit(e, postID)}
                    className="comment-publish"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
          {post.comments.dataComments.map((comment, i) => (
            <Comment
              key={comment.id}
              postID={postID}
              comment={comment}
              mergedState={mergedState}
              randomUser={post.comments.dataRandomUser[i]}
              dataRandomUserLength={dataRandomUser.results.length}
              commentsLength={post.comments.dataComments.length}
              likeComment={likeComment}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
