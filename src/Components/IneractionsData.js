import React from "react";

const InteractionsData = ({
  currentPost,
  currentComment,
  containerStyle,
  itemStyle,
  comments,
  likes,
  shares,
  replies,
}) => (
  <div className="interactions-count" style={containerStyle}>
    {(currentComment || currentPost) && likes && (
      <div
        className="interactions-likes-container interaction-count-container"
        style={itemStyle}
      >
        Likes
        <div className="interactions-likes-count interaction-count">
          {currentComment ? currentComment.likes : currentPost.likes}
        </div>
      </div>
    )}
    {currentPost && comments && (
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
    {currentComment && replies && (
      <div
        className="interactions-replies-container interaction-count-container"
        style={itemStyle}
      >
        Replies
        <div className="interactions-replies-count interaction-count">
          {currentComment.replies}
        </div>
      </div>
    )}
    {currentPost && shares && (
      <div
        className="interactions-shares-container interaction-count-container"
        style={itemStyle}
      >
        Shares
        <div className="interactions-shares-count interaction-count">
          {currentPost.shares}
        </div>
      </div>
    )}
  </div>
);

export default InteractionsData;
