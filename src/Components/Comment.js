import React, { useState } from "react";
import { upperCaseFirst, randomDate, getTodaysDate } from "./_parsingFunctions";
const Comment = ({
  currentComment,
  currentPost,
  randomUser,
  mergedState,
  dataRandomUserLength,
  commentsLength,
  setMergedState,
}) => {
  // STATE
  const [commentData] = useState(
    dataRandomUserLength === commentsLength
      ? {
          date: randomDate(),
          picture: randomUser.picture.thumbnail,
          name: `${randomUser.name.first} ${randomUser.name.last}`,
        }
      : {
          date: getTodaysDate(),
          picture: mergedState.dataProfile.image,
          name: mergedState.dataProfile.name,
        }
  );

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
            src={commentData.picture}
            alt="thumbnail"
          />
          <div className="comment-name-date">
            <div className="comment-name">{commentData.name}</div>
            <div className="comment-date">{commentData.date}</div>
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
