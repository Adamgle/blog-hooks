import React, { useEffect, useRef, useState } from "react";
import { useFetch } from "./useFetch";
import { upperCaseFirst, randomDate, getTodaysDate } from "./_parsingFunctions";
import TextareaAutosize from "react-textarea-autosize";

const Comments = ({
  postID,
  randomNumberRef,
  showComments,
  mergedState,
  setMergedState,
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
                dataComments: dataComments,
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

  console.log(commentsObject.comments.dataComments);

  const textAreaRef = useRef(null);

  const handleSubmit = () => {
    // if (!loadingComments && !loadingRandomUser) {
    //   setMergedState((prevState) => {
    //     return {
    //       ...prevState,
    //       posts: prevState.posts.map((post, i) => {
    //         if (post.id === postID) {
    //           post.comments.dataComments = {
    //             ...post.comments,
    //             body: post.comments.textField,
    //             email: "Eliseo@gardner.biz",
    //             id: 12391283,
    //             name: prevState.dataProfile.name,
    //             postId: 12312,
    //           };
    //         }
    //         return post;
    //       }),
    //     };
    //   });
    // }
  };

  // POSSIBLE SHIT
  const handleKeyPress = (event) => {
    // if (event.key === "Enter") {
    //   handleSubmit();
    //   console.log("works");
    // }
  };

  const handleChange = (e) => {
    if (!loadingComments && !loadingRandomUser) {
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
    }
  };

  return (
    <div className={`comments-container ${!showComments ? "hidden" : ""}`}>
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
                onSubmit={handleSubmit}
                onKeyDown={(e) => handleKeyPress(e)}
              >
                <TextareaAutosize
                  // DEBUG THE REF, PASS WHEN CLICK ON ADD COMMENT
                  ref={textAreaRef}
                  autoFocus
                  className="comment-textarea"
                  onChange={(e) => handleChange(e)}
                />
              </form>
            </div>
          </div>
          {commentsObject.comments.dataComments.map((comment, i) => (
            <Comment
              key={comment.id}
              comment={comment}
              randomUser={dataRandomUser.results[i]}
            />
          ))}
        </>
      )}
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

// const SubmittedComment = ({ image, name, date, content }) => {
//   return (
//     <div className="comment">
//       <div className="comment-picture-container">
//         <img className="comment-picture" src={image} alt="thumbnail" />
//         <div className="comment-name-date">
//           <div className="comment-name">{name}</div>
//           <div className="comment-date">{date}</div>
//         </div>
//       </div>
//       <div className="comment-content">{upperCaseFirst(content, true)}</div>
//       {/* <div>EMAIL: {comment.email}</div> */}
//     </div>
//   );
// };
export { Comments, Comment };
