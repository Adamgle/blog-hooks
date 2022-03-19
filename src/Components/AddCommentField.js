import { nanoid } from "nanoid";
import React from "react";
import TextAreaAutosizeRef from "./TextAreaAutosizeRef";

const AddCommentField = ({
  mergedState,
  textAreaRef,
  currentPost,
  doTextAreaFocus,
  setMergedState,
  setDoTextAreaFocus,
  setCommentsCounter,
}) => {
  const handleChange = (e) => {
    // SET INPUT TEXT ON STATEFULL VALUE
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.map((post) => {
          if (post.id === currentPost.id) {
            post.comments = {
              ...post.comments,
              textField: e.target.value,
            };
          }
          return post;
        }),
      };
    });
    setDoTextAreaFocus(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ADD COMMENT
    if (currentPost.comments.textField) {
      setMergedState((prevState) => {
        return {
          ...prevState,
          posts: prevState.posts.map((post) => {
            return post.id === currentPost.id
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
                        postId: post.id,
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
    // CLEAR TEXTFIELD AFTER SUBMIT
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.map((post) => {
          if (post.id === currentPost.id) {
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
    if (currentPost.comments.textField) {
      setDoTextAreaFocus(false);
    }
  };

  // HANDLE SUBMIT ON ENTER ON MOBILE
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e, currentPost.id);
      // CLEAR FOCUS AFTER SUBMIT ON TEXTAREA
      if (currentPost.comments.textField) {
        setDoTextAreaFocus(false);
      }
    }
  };

  return (
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
          onKeyDown={(e) => handleKeyDown(e)}
        >
          <TextAreaAutosizeRef
            ref={textAreaRef}
            currentPost={currentPost}
            handleChange={handleChange}
            doTextAreaFocus={doTextAreaFocus}
          />
          <div className="comment-publish-container">
            <button
              onClick={(e) => handleSubmit(e)}
              className="comment-publish"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCommentField;
