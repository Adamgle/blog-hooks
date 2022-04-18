import React from "react";

const InteractionsData = ({
  currentPost,
  currentComment,
  containerStyle,
  itemStyle,
  comments,
  likes,
  shares,
}) => {
  return (
    currentPost && (
      <div className="interactions-count" style={containerStyle}>
        {likes && (
          <div
            className="interactions-likes-container interaction-count-container"
            style={itemStyle}
          >
            Likes
            <div className="interactions-likes-count interaction-count">
              {currentPost.likes}
            </div>
          </div>
        )}
        {comments && (
          <div
            className="interactions-replies-container interaction-count-container"
            style={itemStyle}
          >
            Comments
            <div className="interactions-replies-count interaction-count">
              {currentPost.comments.commentsLength}
            </div>
          </div>
        )}
        {currentComment && shares && (
          <div
            className="interactions-replies-container interaction-count-container"
            style={itemStyle}
          >
            Replies
            <div className="interactions-replies-count  interaction-count">
              {currentComment.replies}
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default InteractionsData;
