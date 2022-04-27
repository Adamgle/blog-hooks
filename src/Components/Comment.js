import React from "react";
import InteractionsData from "./IneractionsData";

const Comment = ({
  currentComment,
  setMergedState,
  currentPost,
  user,
  sortMethod,
}) => {
  const handleLikeComment = () => {
    setMergedState((prevState) => {
      return {
        ...prevState,
        [sortMethod]: {
          ...prevState[sortMethod],
          posts: prevState[sortMethod].posts.map((post) => {
            return post.id === currentPost.id
              ? {
                  ...post,
                  comments: {
                    ...post.comments,
                    dataComments: post.comments.dataComments.map((comment) => {
                      return comment.id === currentComment.id
                        ? { ...comment, likes: comment.likes + 1 }
                        : comment;
                    }),
                  },
                }
              : post;
          }),
        },
      };
    });
  };

  return (
    <div className="comment">
      <div className="comment-inner-container">
        <div className="comment-picture-container">
          <img
            className="comment-picture"
            src={user.picture.thumbnail}
            alt="thumbnail"
          />
          <div className="comment-name-date">
            <div className="comment-name">{user.name.fullName}</div>
            <div className="comment-date">{currentComment.commentDate}</div>
          </div>
        </div>
        <div className="comment-content">{currentComment.body}</div>
      </div>
      <div className="comment-interactions noselect">
        <div className="comment-interactions-container">
          <div className="comment-interaction-like-container comment-interaction-container">
            <button
              className="comment-interaction-like comment-interaction"
              onClick={handleLikeComment}
            >
              Like it!
            </button>
          </div>
          <div className="comment-interaction-reply-container comment-interaction-container">
            <button className="comment-interaction-reply comment-interaction">
              Reply
            </button>
          </div>
        </div>
        <InteractionsData
          currentPost={currentPost}
          currentComment={currentComment}
          comments={false}
          likes={true}
          replies={true}
        />
      </div>
    </div>
  );
};

export default Comment;
