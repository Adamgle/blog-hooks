import React, { useEffect } from "react";
import { useFetch } from "./Hooks/useFetch";
import { nanoid } from "nanoid";
import Comment from "./Comment";
import AddCommentField from "./AddCommentField";
import { randomDate, upperCaseFirst } from "./_parsingFunctions";

const Comments = ({
  currentPost,
  currentPostID,
  mergedState,
  commentsFetchedLength,
  showComments,
  setMergedState,
  sortMethod,
  windowDimensions,
  textAreaRef,
}) => {
  const dbComments = `https://jsonplaceholder.typicode.com/posts/${currentPostID}/comments/?_limit=${commentsFetchedLength}`;
  const dbRandomUser = `https://randomuser.me/api/?results=${commentsFetchedLength}&noinfo`;

  const { data: dataComments, loading: loadingComments } = useFetch(dbComments);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);

  // CREATE COMMENTS DATA ON MOUNT WITH CONSIDERATION ON FETCH CALLS
  useEffect(() => {
    if (!loadingComments && !loadingRandomUser) {
      setMergedState((prevState) => {
        console.log(prevState[sortMethod]?.posts);
        console.log(prevState[sortMethod]);
        return {
          ...prevState,
          [sortMethod]: {
            ...prevState[sortMethod],
            posts: prevState[sortMethod].posts.map((post) => {
              if (post.id === currentPost.id) {
                return post.comments.dataComments === undefined
                  ? {
                      ...post,
                      comments: {
                        ...post.comments,
                        dataComments: dataComments.map((comment, i) => ({
                          ...comment,
                          id: nanoid(),
                          picture: dataRandomUser.results[i].picture.thumbnail,
                          likes: 0,
                          replies: 0,
                          commentDate: randomDate(),
                          body: upperCaseFirst(comment.body, true),
                          user: {
                            ...dataRandomUser.results[i],
                            name: {
                              ...dataRandomUser.results[i].name,
                              fullName: `${dataRandomUser.results[i].name.first} ${dataRandomUser.results[i].name.last}`,
                            },
                          },
                        })),
                        textField: "",
                      },
                    }
                  : {
                      ...post,
                      comments: {
                        ...post.comments,
                        dataComments: post.comments.dataComments,
                      },
                    };
              }
              return post;
            }),
          },
        };
      });
    }
  }, [
    currentPost.id,
    setMergedState,
    dataComments,
    dataRandomUser,
    loadingComments,
    loadingRandomUser,
    sortMethod,
  ]);

  // COMPUTE CURRENT VIEWPORT
  // IF USER PASS A LOT OF TEXT IN ONE WORD "LONG STRING WITHOUT WHITE CHARACTER"
  // -> IN TEXTFIELD THEN APPLICATION UI WILL BROKE ->
  // THIS STATEMENT HANDLES THAT THE CONTAINER WILL FIT TO VIEWPORT ->
  // WITH CONSIDERATION ON PADDING, MARGINS AND BORDERS SO THAT ->
  // TEXT WILL FIT TO CONTAINER CAUSING WORD WRAP "OR LETTERS WRAP"
  // const commentsDynamicStyles = {
  //   maxWidth:
  //     windowDimensions.width > 900
  //       ? "863px"
  //       : windowDimensions.width <= 900 && windowDimensions.width > 700
  //       ? `${windowDimensions.width - 77}px` // 900 - 701 viewport
  //       : `${windowDimensions.width - 67}px`, // >=700 viewport
  // };

  return (
    <div
      className={`comments-container ${!showComments ? "hidden" : ""}`}
      // style={com mentsDynamicStyles}
    >
      <div className="comments-label">Comments</div>
      {!currentPost.comments.dataUsers && !currentPost.comments.dataComments ? (
        // WAIT FOR ALL APIS AND STATE MERGES, THEN DISPLAY DATA
        // IF AT LEAST ONE OF THEM ARE FALSY THEN DISPLAY "LOADING..."
        "Loading..."
      ) : (
        <>
          <AddCommentField
            mergedState={mergedState}
            setMergedState={setMergedState}
            textAreaRef={textAreaRef}
            currentPost={currentPost}
            sortMethod={sortMethod}
          />
          {currentPost.comments.dataComments.map((comment) => (
            <Comment
              key={comment.id}
              currentPost={currentPost}
              currentComment={comment}
              mergedState={mergedState}
              user={comment.user}
              setMergedState={setMergedState}
              sortMethod={sortMethod}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
