import React from "react";
import { upperCaseFirst } from "./_parsingFunctions";

const Comment = ({ currentComment, setMergedState, currentPost, user }) => {
  const likeComment = () => {
    setMergedState((prevState) => {
      return {
        ...prevState,
        posts: prevState.posts.map((post) => {
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
        <div className="comment-content">
          {upperCaseFirst(currentComment.body, true)}
        </div>
      </div>
      <div className="comment-interactions noselect">
        <div className="comment-interactions-container">
          <div className="comment-interaction-like-container comment-interaction-container">
            <button
              className="comment-interaction-like comment-interaction"
              onClick={likeComment}
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
        <div className="comment-interactions-count">
          <div className="comment-interactions-likes-container comment-interaction-count-container">
            Likes
            <div className="comment-interactions-likes-count comment-interaction-count">
              {currentComment.likes}
            </div>
          </div>
          <div className="comment-interactions-replies-container comment-interaction-count-container">
            Replies
            <div className="comment-interactions-replies-count comment-interaction-count">
              {currentComment.replies}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
