import React, { useState, useRef, useEffect } from "react";
import { Comments } from "./Comments";
import { useFetch } from "./useFetch";
import {
  upperCaseFirst,
  randomDate,
  concatFetchedContent,
} from "./_parsingFunctions";
import useWindowDimensions from "./useWindowDimensions";
import Post from "./Post";

const Posts = () => {
  // STATE
  const [usersCount, setUsersCount] = useState(2);
  const [mergedState, setMergedState] = useState(null);

  // DB'S
  const dbUsers = `https://jsonplaceholder.typicode.com/posts/?_limit=${usersCount}`;
  const dbRandomUser = `https://randomuser.me/api/?results=${usersCount}&noinfo`;
  const dbRandomPicture = `https://picsum.photos/v2/list?page=2&limit=100`;

  // FETCH CALLS
  const { data: dataPosts, loading: loadingPosts } = useFetch(dbUsers);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);
  const { data: dataRandomPicture, loading: loadingRandomPicture } =
    useFetch(dbRandomPicture);

  // MERGE DATA FROM FETCH CALLS TO ONE STATEFULL OBJECT TYPE VALUE
  useEffect(() => {
    // WAIT FOR ALL FETCH CALLS BE PROCCESSED
    if (!loadingPosts && !loadingRandomUser && !loadingRandomPicture) {
      setMergedState({
        posts: dataPosts.map((post) => ({
          ...post,
          comments: {},
          likes: 0,
          isRead: false,
        })),
        dataRandomUser: dataRandomUser.results,
        dataRandomPicture: dataRandomPicture,
        dataProfile: {
          name: "Adam",
          image:
            "https://brokeinlondon.com/wp-content/uploads/2012/01/Facebook-no-profile-picture-icon-620x389.jpg",
          email: "adam.dev@gmail.com",
        },
        isAdmin: false,
      });
    }
  }, [loadingPosts, loadingRandomUser, loadingRandomPicture]);

  return (
    <div className="posts-container">
      <div className="posts">
        {loadingPosts ||
        loadingRandomUser ||
        loadingRandomPicture ||
        !mergedState
          ? "Loading..."
          : // dataPosts as State
            mergedState.posts.map((post, i) => (
              <Post
                key={post.id}
                post={post}
                randomUser={mergedState.dataRandomUser[post.id - 1]}
                loadingRandomUser={loadingRandomUser}
                loadingRandomPicture={loadingRandomPicture}
                setMergedState={setMergedState}
                mergedState={mergedState}
              />
            ))}
      </div>
    </div>
  );
};

export default Posts;
