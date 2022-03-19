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
  const [intersecting, setIntersecting] = useState(false);
  const [{ fetchCountValue, pageNumberValue }, setFetchDeps] = useState({
    fetchCountValue: 0,
    pageNumberValue: 1,
  });

  // REFS
  // LAST SECOND POST
  const [secondLastElement, setSecondLastElement] = useState(null);
  // REF TO OBSERVER
  const observer = useRef(null);
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

  // LOAD DATABASES
  useEffect(() => {
    setDbPosts(
      `https://jsonplaceholder.typicode.com/posts?_start=${fetchCount}&_limit=5`
    );
    setDbRandomUser(
      `https://randomuser.me/api/?page=${pageNumber}&results=5&seed=${usersSeed}`
    );
  }, [fetchCount, pageNumber, usersSeed]);

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
                      id: post.id,
                      comments: {},
                      likes: 0,
                      isRead: false,
                    })),
                  ]
                : dataPosts.map((post) => ({
                    ...post,
                    id: post.id,
                    comments: {},
                    likes: 0,
                    isRead: false,
                  })),
            dataRandomUser:
              prevState && prevState.dataRandomUser
                ? [...prevState.dataRandomUser, ...dataRandomUser.results]
                : dataRandomUser.results,
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
    if (fetchCountValue >= 100 || pageNumberValue >= 21) {
      setBeenFullRequested(true);
    }
  }, [fetchCountValue, pageNumberValue]);

  useEffect(() => {
    if (intersecting) {
      setFetchDeps((prevState) => {
        if (beenFullRequested) {
          return {
            fetchCountValue: Math.trunc(Math.random() * 95),
            pageNumberValue: Math.trunc(Math.random() * 20),
          };
        }
        return {
          fetchCountValue: prevState.fetchCountValue + 5,
          pageNumberValue: prevState.pageNumberValue + 1,
        };
      });
    }
    return;
  }, [beenFullRequested, intersecting]);

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
          setIntersecting(post.isIntersecting);
          if (
            !post.isIntersecting ||
            fetchCountValue >= 100 ||
            pageNumberValue >= 21
          ) {
            return;
          }

          setUrlDeps({
            fetchCount: fetchCountValue,
            pageNumber: pageNumberValue,
          });

          createdObserver.unobserve(post.target);
          createdObserver.disconnect();
        }, options);

        createdObserver.observe(observer.current);
      }
    }
  }, [fetchStatus, secondLastElement, fetchCountValue, pageNumberValue]);

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
                  setMergedState={setMergedState}
                  mergedState={mergedState}
                  // Shit down there
                  fetchStatus={fetchStatus}
                  dataPosts={dataPosts}
                  dataRandomPicture={dataRandomPicture}
                  dataRandomUser={dataRandomUser}
                  loadingPosts={loadingPosts}
                  loadingRandomPicture={loadingRandomPicture}
                  loadingRandomUser={loadingRandomUser}
                />
              ) : (
                <Post
                  key={post.id}
                  post={post}
                  randomUser={mergedState.dataRandomUser[i]}
                  setMergedState={setMergedState}
                  mergedState={mergedState}
                  fetchStatus={fetchStatus}
                  dataPosts={dataPosts}
                  dataRandomPicture={dataRandomPicture}
                  dataRandomUser={dataRandomUser}
                  loadingPosts={loadingPosts}
                  loadingRandomPicture={loadingRandomPicture}
                  loadingRandomUser={loadingRandomUser}
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
