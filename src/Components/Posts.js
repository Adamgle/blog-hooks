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
  const [storeState, setStoreState] = useState(null);
  const { current: usersSeed } = useRef("usersSeed");

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
  }, [fetchCount, pageNumber, usersSeed]);

  // https://jsonplaceholder.typicode.com/posts?_start=10&_limit=5

  // console.log(mergedState);

  // FETCH CALLS
  const { data: dataPosts, loading: loadingPosts } = useFetch(dbPosts);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);
  const { data: dataRandomPicture, loading: loadingRandomPicture } =
    useFetch(dbRandomPicture);

  // console.log(loadingPosts, loadingRandomUser, loadingRandomPicture);

  // useEffect(() => {
  //   if (fetchStatus) {
  //     setStoreState({

  //     });
  //   }
  // }, [dataPosts, dataRandomUser]);

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
      setStoreState((prevState) => {
        console.log(prevState);
        if (
          prevState &&
          prevState.postsData &&
          prevState.postsData.length &&
          prevState.randomUsersData &&
          prevState.randomUsersData.length
        ) {
          console.log("storestate");
          return {
            postsData: [...prevState.postsData, ...dataPosts],
            randomUsersData: [
              ...prevState.randomUsersData,
              ...dataRandomUser.results,
            ],
          };
        } else {
          return {
            postsData: dataPosts,
            randomUsersData: dataRandomUser.results,
          };
        }
      });
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
      } else {
        setMergedState((prevState) => {
          return {
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
          };
        });
      }
    }
    // PROBABLY GOOD CODE THERE
  }, [fetchStatus]);

  useEffect(() => {
    if (storeState) {
        setMergedState((prevState) => {
          return {
            ...prevState,
            posts: storeState.postsData.map((post) => ({
              ...post,
              comments: {},
              likes: 0,
              isRead: false,
            })),
            dataRandomUser: storeState.randomUsersData,
          };
        });
    }
  }, [storeState]);

  console.log(storeState);
  console.log(mergedState);

  if (fetchStatus) {
    console.log(dataPosts);
    console.log(dataRandomUser.results);
  }

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
          rootMargin: "0px",
          threshold: 0.2,
        };

        const createdObserver = new IntersectionObserver((entries) => {
          const post = entries[0];
          if (mergedState.posts.length >= 100) {
            createdObserver.disconnect();
            return;
          }
          if (!post.isIntersecting) {
            return;
          }

          setUrlDeps((prevState) => ({
            fetchCount: prevState.fetchCount + 5,
            pageNumber: prevState.pageNumber + 1,
          }));

          createdObserver.unobserve(post.target);
          createdObserver.disconnect();
        }, options);

        createdObserver.observe(observer.current);
      }
    }
  }, [secondLastElement]);

  return (
    <div className="posts-container">
      <div className="posts">
        {!fetchStatus || !mergedState || !secondLastElement
          ? "Loading..."
          : // dataPosts as State
            mergedState.posts.map((post) => {
              return post.id === secondLastElement.id ? (
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
