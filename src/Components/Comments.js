import React, { useEffect, useRef } from "react";
import { useFetch } from "./useFetch";
import { upperCaseFirst, randomDate } from "./_parsingFunctions";

const Comments = ({
  postID,
  randomNumberRef,
  showComments,
  setCommentsLength,
}) => {
  const dbComments = `https://jsonplaceholder.typicode.com/posts/${postID}/comments/?_limit=${randomNumberRef}`;
  const dbRandomUser = `https://randomuser.me/api/?results=${randomNumberRef}&noinfo`;

  const { data: dataComments, loading: loadingComments } = useFetch(dbComments);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);

  return (
    <div className={`comments-container ${!showComments ? "hidden" : ""}`}>
      <div className="comments-label">
        <h4>Comments</h4>
      </div>
      {loadingComments || loadingRandomUser // false, false
        ? "Loading..."
        : dataComments.map((comment, i) => (
            <Comment
              key={comment.id}
              comment={comment}
              randomUser={dataRandomUser.results[i]}
            />
          ))}
    </div>
  );
};

const Comment = ({ comment, randomUser }) => {
  const randomDateRef = useRef(randomDate());

  return (
    <div className="comment">
      <div className="comment-picture-container">
        <img
          className="comment-picture"
          src={randomUser.picture.thumbnail}
          alt="thumbnail"
        />
        <div className="comment-name-date">
          <div className="comment-name">{comment.email.split("@")[0]}</div>
          <div className="comment-date">{randomDateRef.current}</div>
        </div>
      </div>
      <div className="comment-content">
        {upperCaseFirst(comment.body, true)}
      </div>
      {/* <div>EMAIL: {comment.email}</div> */}
    </div>
  );
};

export { Comments, Comment };
