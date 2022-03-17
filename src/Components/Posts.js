import { nanoid } from "nanoid";
import React, { useState, useEffect, useRef } from "react";
import { useFetch } from "./Hooks/useFetch";
import Post from "./Post";

const Posts = () => {
  // STATE
  const [{ fetchCount, pageNumber }, setUrlDeps] = useState({
    fetchCount: 0,
    pageNumber: 1,
  });
  const [mergedState, setMergedState] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(false);
  const [beenFullRequested, setBeenFullRequested] = useState(null);

  const { current: usersSeed } = useRef("usersSeed");

  console.log(mergedState);

  // DB'S
  const [dbPosts, setDbPosts] = useState(
    `https://jsonplaceholder.typicode.com/posts?_start=${fetchCount}&_limit=5`
  );
  const [dbRandomUser, setDbRandomUser] = useState(
    `https://randomuser.me/api/?page=${pageNumber}&results=5&seed=${usersSeed}`
  );
  const [dbRandomPicture, setDbRandomPicture] = useState(
    `https://picsum.photos/v2/list?page=2&limit=100`
  );

  // REFS
  // LAST SECOND POST
  const [secondLastElement, setSecondLastElement] = useState(null);
  // REF TO OBSERVER
  const observer = useRef(null);

  // LOAD DATABASES
  useEffect(() => {
    setDbPosts(
      `https://jsonplaceholder.typicode.com/posts?_start=${fetchCount}&_limit=5`
    );
    setDbRandomUser(
      `https://randomuser.me/api/?page=${pageNumber}&results=5&seed=${usersSeed}`
    );
  }, [fetchCount, pageNumber, usersSeed, beenFullRequested]);

  // FETCH CALLS
  const { data: dataPosts, loading: loadingPosts } = useFetch(dbPosts);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);
  const { data: dataRandomPicture, loading: loadingRandomPicture } =
    useFetch(dbRandomPicture);

  useEffect(() => {
    // IF NOT LOADING THEN SET FETCH STATUS TO TRUE
    if (
      !loadingPosts &&
      !loadingRandomUser &&
      !loadingRandomPicture &&
      dataPosts &&
      dataRandomUser &&
      dataRandomUser.results.length &&
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
      if (dataPosts.length !== dataRandomUser.results.length) {
        return;
      } else if (
        !loadingPosts &&
        !loadingRandomUser &&
        dataPosts &&
        dataRandomUser &&
        dataRandomUser.results.length
      ) {
        console.log("worlking");
        setMergedState((prevState) => {
          return {
            posts:
              prevState && prevState.posts
                ? [
                    ...prevState.posts,
                    ...dataPosts.map((post) => ({
                      ...post,
                      id: nanoid(),
                      comments: {},
                      likes: 0,
                      isRead: false,
                    })),
                  ]
                : dataPosts.map((post) => ({
                    ...post,
                    id: nanoid(),
                    comments: {},
                    likes: 0,
                    isRead: false,
                  })),
            dataRandomUser:
              prevState && prevState.dataRandomUser
                ? [
                    ...prevState.dataRandomUser,
                    ...dataRandomUser.results.map((users) => {
                      return { ...users, id: nanoid() };
                    }),
                  ]
                : dataRandomUser.results.map((users) => {
                    return { ...users, id: nanoid() };
                  }),
            dataRandomPicture: dataRandomPicture,
            dataProfile: {
              name: "Adam",
              image:
                "https://brokeinlondon.com/wp-content/uploads/2012/01/Facebook-no-profile-picture-icon-620x389.jpg",
              email: "adam.dev@gmail.com",
            },
            isAdmin: false,
          };
        });
      }
    }
    // PROBABLY GOOD CODE THERE
  }, [
    fetchStatus,
    dataPosts,
    dataRandomPicture,
    dataRandomUser,
    loadingPosts,
    loadingRandomPicture,
    loadingRandomUser,
  ]);

  useEffect(() => {
    if (mergedState && fetchStatus) {
      setSecondLastElement(
        mergedState.posts.length >= 3
          ? mergedState.posts[mergedState.posts.length - 1]
          : true
      );
    }
  }, [fetchStatus, mergedState]);

  useEffect(() => {
    if (fetchStatus) {
      if (observer && observer.current) {
        const options = {
          root: null,
          rootMargin: "300px 0px 0px 0px",
          threshold: 0.2,
        };

        const createdObserver = new IntersectionObserver((entries) => {
          const post = entries[0];
          // if (mergedState.posts.length >= 100) {
          //   createdObserver.disconnect();
          //   return;
          // }
          if (!post.isIntersecting) {
            return;
          }
          // TODO -> RANDOMIZE THERE
          setUrlDeps((prevState) => {
            if (prevState) {
              return {
                fetchCount: beenFullRequested
                  ? Math.trunc(Math.random() * 95)
                  : prevState.fetchCount + 5,
                pageNumber: beenFullRequested
                  ? Math.trunc(Math.random() * 19)
                  : prevState.pageNumber + 1,
              };
            }
          });

          createdObserver.unobserve(post.target);
          createdObserver.disconnect();
        }, options);

        createdObserver.observe(observer.current);
      }
    }
  }, [fetchStatus, secondLastElement, beenFullRequested]);

  useEffect(() => {
    if (fetchCount >= 95 && pageNumber >= 19) {
      setBeenFullRequested(true);
    }
  }, [fetchCount, pageNumber]);

  return (
    <div className="posts-container">
      <div className="posts">
        {!fetchStatus || !mergedState || !secondLastElement
          ? "Loading..."
          : // dataPosts as State
            mergedState.posts.map((post, i) => {
              return post.id === secondLastElement.id ? (
                <Post
                  observer={observer}
                  key={post.id}
                  post={post}
                  randomUser={mergedState.dataRandomUser[i]}
                  fetchStatus={fetchStatus}
                  setMergedState={setMergedState}
                  mergedState={mergedState}
                />
              ) : (
                <Post
                  key={post.id}
                  post={post}
                  randomUser={mergedState.dataRandomUser[i]}
                  fetchStatus={fetchStatus}
                  setMergedState={setMergedState}
                  mergedState={mergedState}
                />
              );
            })}
        {fetchStatus && (!loadingPosts || !loadingRandomUser) && (
          <div className="await">Fetching Data...</div>
        )}
      </div>
    </div>
  );
};

export default Posts;
