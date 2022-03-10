import React, { useEffect, useRef, useState } from "react";
import { useFetch } from "./useFetch";
import { upperCaseFirst, randomDate, getTodaysDate } from "./_parsingFunctions";
import TextareaAutosize from "react-textarea-autosize";
import useWindowDimensions from "./useWindowDimensions";

const Comments = ({
  postID,
  randomNumberRef,
  showComments,
  mergedState,
  setMergedState,
  post,
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
                })),
                dataRandomUser: dataRandomUser.results,
                likes: 0,
                textField: "",
              };
            }
            return post;
          }),
        };
      });
    }
  }, [loadingComments, loadingRandomUser]);

  const commentsObject = mergedState.posts.filter((post) => {
    if (!loadingComments && !loadingRandomUser) {
      return post.id === postID;
    }
    return post;
  })[0];

  const handleChange = (e) => {
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
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
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
                      ...post.comments.dataComments,
                      {
                        body: post.comments.textField,
                        // MAKE EMAIL ETC. INFORMATION COMING FROM PROFILE OBJECT
                        // IN STATE
                        email: "Presley.Mueller@myrl.com",
                        id: "SASASA",
                        name: "et fugit eligendi deleniti quidem qui sint nihil autem",
                        picture:
                          "https://randomuser.me/api/portraits/thumb/men/67.jpg",
                        postId: "SASASAASA",
                      },
                    ],
                  },
                }
              : post;
          }),
        };
      });
    }
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
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event, postID);
    }
  };

  const windowDimensions = useWindowDimensions();

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
      !commentsObject.comments.dataComments ? (
        // false, false
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
                className="comment-form"
                onKeyDown={(e) => handleKeyPress(e)}
              >
                <TextareaAutosize
                  // DEBUG THE REF, PASS WHEN CLICK ON ADD COMMENT
                  // ref={textAreaRef}
                  // autoFocus
                  className="comment-textarea"
                  onChange={(e) => handleChange(e)}
                  value={post.comments.textField}
                />
                <button onClick={(e) => handleSubmit(e, postID)}>
                  Publish
                </button>
              </form>
            </div>
          </div>
          {commentsObject.comments.dataComments.map((comment, i) => (
            <Comment
              key={comment.id}
              comment={comment}
              randomUser={dataRandomUser.results[i]}
              mergedState={mergedState}
            />
          ))}
        </>
      )}
    </div>
  );
};

const Comment = ({ comment, randomUser, mergedState }) => {
  // STATE
  const [commentData, setCommentData] = useState({
    date: randomUser ? randomDate() : getTodaysDate(),
    picture: randomUser
      ? randomUser.picture.thumbnail
      : mergedState.dataProfile.image,
    name: randomUser
      ? `${randomUser.name.first} ${randomUser.name.last}`
      : mergedState.dataProfile.name,
  });

  return (
    <div className="comment">
      <div className="comment-picture-container">
        <img
          className="comment-picture"
          src={commentData.picture}
          alt="thumbnail"
        />
        <div className="comment-name-date">
          <div className="comment-name">{commentData.name}</div>
          <div className="comment-date">{commentData.date}</div>
        </div>
      </div>
      <div className="comment-content">
        {upperCaseFirst(comment.body, true)}
      </div>
    </div>
  );
};

export { Comments, Comment };
