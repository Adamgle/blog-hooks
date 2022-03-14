import React, { useState, useEffect, useRef } from "react";
import { useFetch } from "./Hooks/useFetch";
import Post from "./Post";

const Posts = () => {
  // STATE
  const [usersCount, setUsersCount] = useState(5);
  const [mergedState, setMergedState] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(false);
  // DB'S
  const [dbPosts, setDbPosts] = useState(null);
  const [dbRandomUser, setDbRandomUser] = useState(null);
  const [dbRandomPicture, setDbRandomPicture] = useState(null);

  // REACTIVE FETCH DATA
  const [reactiveDataPosts, setReactiveDataPosts] = useState(null);
  const [reactiveRandomUsers, setReactiveRandomUsers] = useState(null);

  // LAST SECOND POST
  const [secondLastElement, setSecondLastElement] = useState(null);

  // REFS
  const observer = useRef(null);

  // LOAD DATABASES
  useEffect(() => {
    setDbPosts(
      `https://jsonplaceholder.typicode.com/posts/?_limit=${usersCount}`
    );
    setDbRandomUser(`https://randomuser.me/api/?results=${usersCount}&noinfo`);
    setDbRandomPicture(`https://picsum.photos/v2/list?page=2&limit=100`);
  }, [usersCount]);

  console.log(dbPosts, fetchStatus);
  console.log(dbRandomUser, fetchStatus);
  console.log(dbRandomPicture, fetchStatus);
  console.log(mergedState);

  // FETCH CALLS
  const { data: dataPosts, loading: loadingPosts } = useFetch(dbPosts);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);
  const { data: dataRandomPicture, loading: loadingRandomPicture } =
    useFetch(dbRandomPicture);
  console.log(dataPosts);
  console.log(dataRandomUser);
  console.log(dataRandomPicture);

  useEffect(() => {
    // IF NOT LOADING THEN SET FETCH STATUS TO TRUE
    if (
      !loadingPosts &&
      !loadingRandomUser &&
      !loadingRandomPicture &&
      dataPosts &&
      dataRandomUser &&
      dataRandomPicture
    ) {
      setFetchStatus(true);
    }
  }, [
    loadingPosts,
    loadingRandomUser,
    loadingRandomPicture,
    dataPosts,
    dataRandomUser,
    dataRandomPicture,
  ]);

  // MERGE DATA FROM FETCH CALLS TO ONE STATEFULL OBJECT TYPE VALUE
  useEffect(() => {
    // WAIT FOR ALL FETCH CALLS BE PROCCESSED
    if (fetchStatus) {
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
    // PROBABLY GOOD CODE THERE
  }, [fetchStatus, dbPosts, dbRandomUser]);

  useEffect(() => {
    if (fetchStatus) {
      const createObserver = () => {
        if (observer && observer.current) {
          const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.2,
          };

          const createdObserver = new IntersectionObserver((entries) => {
            const post = entries[0];
            if (usersCount >= 100) {
              createdObserver.disconnect();
              return;
            }
            if (!post.isIntersecting) {
              return;
            }

            setUsersCount((prevState) => prevState + 5);

            createdObserver.unobserve(post.target);
            createdObserver.disconnect();
          }, options);

          createdObserver.observe(observer.current);
        }
        return null;
      };
      createObserver();
    }
  }, [fetchStatus, secondLastElement]);

  useEffect(() => {
    if (mergedState && fetchStatus) {
      setSecondLastElement(
        mergedState.posts.length >= 3
          ? mergedState.posts[mergedState.posts.length - 3]
          : true
      );
    }
  }, [fetchStatus, mergedState]);

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
                  fetchStatus={fetchStatus}
                  setMergedState={setMergedState}
                  mergedState={mergedState}
                />
              ) : (
                <Post
                  key={post.id}
                  post={post}
                  randomUser={mergedState.dataRandomUser[post.id - 1]}
                  fetchStatus={fetchStatus}
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
