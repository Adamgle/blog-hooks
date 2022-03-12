import React from "react";
import { upperCaseFirst, randomDate, getTodaysDate } from "./_parsingFunctions";
const Comment = ({
  comment,
  randomUser,
  mergedState,
  dataRandomUserLength,
  commentsLength,
}) => {
  // STATE
  const commentData =
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
          {upperCaseFirst(comment.body, true)}
        </div>
      </div>
      <div className="comment-interactions noselect">
        <div className="comment-interactions-container">
          <div className="comment-interaction-like-container comment-interaction-container">
            <button className="comment-interaction-like comment-interaction">
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
              {/* {comment.likes} */} 0
            </div>
          </div>
          <div className="comment-interactions-replies-container comment-interaction-count-container">
            Replies
            <div className="comment-interactions-replies-count comment-interaction-count">
              {/* {comment.replyCount} */} 0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
