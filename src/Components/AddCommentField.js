import { nanoid } from "nanoid";
import React from "react";
import TextAreaAutosizeRef from "./TextAreaAutosizeRef";
import { getTodaysDate } from "./_parsingFunctions";

const AddCommentField = ({
  mergedState,
  textAreaRef,
  currentPost,
  doTextAreaFocus,
  setMergedState,
}) => {
  const handleChange = (e) => {
    // SET INPUT TEXT ON STATEFULL VALUE
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.map((post) => {
          if (post.id === currentPost.id) {
            return {
              ...post,
              comments: {
                ...post.comments,
                doTextAreaFocus: true,
                textField: e.target.value,
              },
            };
          }
          return post;
        }),
      };
    });
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
                    commentsLength: post.comments.commentsLength + 1,
                    dataComments: [
                      {
                        body: post.comments.textField,
                        email: prevState.dataProfile.email,
                        id: nanoid(),
                        name: "",
                        picture: prevState.dataProfile.picture.thumbnail,
                        postId: post.id,
                        likes: 0,
                        replies: 0,
                        commentDate: getTodaysDate(),
                        user: {
                          ...prevState.dataProfile,
                          name: {
                            ...prevState.dataProfile.name,
                            fullName: `${prevState.dataProfile.name.first} ${prevState.dataProfile.name.last}`,
                          },
                        },
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
    }
    // CLEAR TEXTFIELD AFTER SUBMIT
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.map((post) => {
          if (post.id === currentPost.id) {
            return {
              ...post,
              comments: {
                ...post.comments,
                doTextAreaFocus: post.comments.textField
                  ? false
                  : post.doTextAreaFocus,
                textField: "",
              },
            };
          }
          return post;
        }),
      };
    });
    // CLEAR FOCUS AFTER SUBMIT ON TEXTAREA
    // if (currentPost.comments.textField) {
    //   setDoTextAreaFocus(false);
    // }
  };

  // HANDLE SUBMIT ON ENTER ON MOBILE
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e, currentPost.id);
      // CLEAR FOCUS AFTER SUBMIT ON TEXTAREA
      if (currentPost.comments.textField) {
        setMergedState((prevState) => ({
          ...prevState,
          posts: prevState.posts.map((post) => ({
            ...post,
            comments: { ...post.comments, doTextAreaFocus: false },
          })),
        }));
      }
    }
  };

  return (
    <div className="comment-profile">
      <img
        className="comment-picture-profile picture-profile"
        src={mergedState.dataProfile.picture.thumbnail}
        alt="thumbnail"
      />
      <div className="comment-profile-name">
        <div className="comment-name">
          {mergedState.dataProfile.name.first +
            mergedState.dataProfile.name.last}
        </div>
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
