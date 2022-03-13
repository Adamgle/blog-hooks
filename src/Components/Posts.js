import React, { useState, useEffect, useRef } from "react";
import { useFetch } from "./Hooks/useFetch";
import Post from "./Post";

const Posts = () => {
  // STATE
  const [usersCount, setUsersCount] = useState(15);
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

  // REFS
  const [secondLastElement, setSecondLastElement] = useState(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingPosts, loadingRandomUser, loadingRandomPicture]);

  useEffect(() => {
    if (
      mergedState &&
      !loadingPosts &&
      !loadingRandomUser &&
      !loadingRandomPicture
    ) {
      setSecondLastElement(
        mergedState.posts.length >= 3
          ? mergedState.posts[mergedState.posts.length - 3]
          : true
      );
    }
  }, [loadingPosts, loadingRandomPicture, loadingRandomUser, mergedState]);

  const observer = useRef(null);

  const createObserver = () => {
    if (observer && observer.current) {
      let options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2,
      };

      const handleIntersect = (entries, observer) => {};

      observer.current = new IntersectionObserver(handleIntersect, options);
      observer.current.observe();
    }
  };
  useEffect(() => {
    if (
      observer.current &&
      mergedState &&
      !loadingPosts &&
      !loadingRandomUser &&
      !loadingRandomPicture
    ) {
      if (observer.current) {
        createObserver();
      }
    }
  }, [loadingPosts, loadingRandomPicture, loadingRandomUser, mergedState]);

  console.log(secondLastElement);
  console.log(observer.current);
  return (
    <div className="posts-container">
      <div className="posts">
        {loadingPosts ||
        loadingRandomUser ||
        loadingRandomPicture ||
        !mergedState ||
        !secondLastElement
          ? "Loading..."
          : // dataPosts as State
            mergedState.posts.map((post, i) =>
              post.id === secondLastElement.id ? (
                <Post
                  observer={observer}
                  key={post.id}
                  post={post}
                  randomUser={mergedState.dataRandomUser[post.id - 1]}
                  loadingRandomUser={loadingRandomUser}
                  loadingRandomPicture={loadingRandomPicture}
                  setMergedState={setMergedState}
                  mergedState={mergedState}
                />
              ) : (
                <Post
                  key={post.id}
                  post={post}
                  randomUser={mergedState.dataRandomUser[post.id - 1]}
                  loadingRandomUser={loadingRandomUser}
                  loadingRandomPicture={loadingRandomPicture}
                  setMergedState={setMergedState}
                  mergedState={mergedState}
                />
              )
            )}
      </div>
    </div>
  );
};

export default Posts;
