import { nanoid } from "nanoid";
import React, { useState, useEffect, useRef } from "react";
import { useFetch } from "./Components/Hooks/useFetch";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Components/Header";
import useWindowDimensions from "./Components/Hooks/useWindowDimensions";

const App = () => {
  // STATE
  const [mergedState, setMergedState] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(false);
  const [beenFullRequested, setBeenFullRequested] = useState(null);
  const [intersecting, setIntersecting] = useState(false);
  const [{ fetchCount, pageNumber }, setUrlDeps] = useState({
    fetchCount: 0,
    pageNumber: 1,
  });
  const [{ fetchCountValue, pageNumberValue }, setUrlDepsValues] = useState({
    fetchCountValue: 0,
    pageNumberValue: 1,
  });
  const [fetchNextPosts, setFetchNextPosts] = useState(false);

  // LAST POST
  const [lastElement, setLastElement] = useState(null);

  const navigate = useNavigate();

  // REFS

  // REF TO OBSERVER
  const observer = useRef(null);
  const { current: usersSeed } = useRef("usersSeed");

  // DB'S
  const [dbPosts, setDbPosts] = useState(
    `https://jsonplaceholder.typicode.com/posts?_start=${fetchCount}&_limit=5`
  );
  const [dbRandomUser, setDbRandomUser] = useState(
    `https://randomuser.me/api/?page=${pageNumber}&results=5&seed=${usersSeed}`
  );
  const [dbRandomPicture] = useState(
    `https://picsum.photos/v2/list?page=2&limit=100`
  );

  // SETTING STORAGE TO STATE
  // useEffect(() => {
  //   const data = localStorage.getItem("mergedState");
  //   if (data) {
  //     setMergedState(JSON.parse(data));
  //   }
  // }, []);

  // LOAD DATABASES
  useEffect(() => {
    if (fetchCount !== fetchCountValue || pageNumber !== pageNumberValue) {
      return;
    }
    if (fetchCount !== fetchCountValue || pageNumber !== pageNumberValue) {
      console.log(fetchCount, fetchCountValue);
      console.log(pageNumber, pageNumberValue);
    }
    setDbPosts(
      `https://jsonplaceholder.typicode.com/posts?_start=${fetchCount}&_limit=5`
    );
    setDbRandomUser(
      `https://randomuser.me/api/?page=${pageNumber}&results=5&seed=${usersSeed}`
    );
  }, [fetchCount, fetchCountValue, pageNumber, pageNumberValue, usersSeed]);

  // FETCH CALLS
  const { data: dataPosts, loading: loadingPosts } = useFetch(dbPosts);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);
  const { data: dataRandomPicture, loading: loadingRandomPicture } =
    useFetch(dbRandomPicture);

  useEffect(() => {
    // IF NOT LOADING THEN SET FETCH STATUS TO TRUE
    // FETCH STATUS ARE CHANGING ONLY ONCE, THEN IT'S ALWAYS SET TO TRUE
    if (localStorage.getItem("mergedState")) {
      console.log("done");
      setFetchStatus(true);
      return;
    }
    if (
      !loadingPosts &&
      !loadingRandomUser &&
      !loadingRandomPicture &&
      dataPosts &&
      dataRandomUser?.results.length &&
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

    if (fetchStatus && dataPosts && dataRandomUser && dataRandomPicture) {
      if (dataPosts.length !== dataRandomUser.results.length) {
        return;
      }
      // "ELSE IF" IS PERFORMED FOR INFINITY SCROLLING,
      // WHEN USER GOES ALL THE WAY DOWN THE PAGE, ANOTHER 5 POSTS
      // WILL BE FETCHED AND STATUS WILL BE DIFFERENT
      else if (
        !loadingPosts &&
        !loadingRandomUser &&
        dataPosts &&
        dataRandomUser?.results.length
      ) {
        setMergedState((prevState) => {
          return {
            posts: prevState?.posts
              ? fetchNextPosts
                ? [
                    ...prevState.posts,
                    ...dataPosts.map((post, i) => {
                      return {
                        ...post,
                        postID: post.id,
                        id: nanoid(),
                        comments: {},
                        likes: 0,
                        isRead: false,
                        user: dataRandomUser.results[i],
                      };
                    }),
                  ]
                : prevState.posts
              : dataPosts.map((post, i) => {
                  return {
                    ...post,
                    postID: post.id,
                    id: nanoid(),
                    comments: {},
                    likes: 0,
                    isRead: false,
                    user: dataRandomUser.results[i],
                  };
                }),
            dataRandomUser: prevState?.dataRandomUser
              ? fetchNextPosts
                ? [
                    ...prevState.dataRandomUser,
                    ...dataRandomUser.results.map((user) => ({
                      ...user,
                      id: nanoid(),
                      name: {
                        ...user.name,
                        fullName: `${user.name.first} ${user.name.last}`,
                      },
                    })),
                  ]
                : prevState.dataRandomUser
              : dataRandomUser.results.map((user) => ({
                  ...user,
                  id: nanoid(),
                  name: {
                    ...user.name,
                    fullName: `${user.name.first} ${user.name.last}`,
                  },
                })),
            dataRandomPicture: dataRandomPicture,
            dataProfile: {
              name: {
                title: "",
                first: "Adam",
                last: "",
              },
              picture: {
                thumbnail:
                  "https://brokeinlondon.com/wp-content/uploads/2012/01/Facebook-no-profile-picture-icon-620x389.jpg",
              },
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

  // THIS IS BUGGED
  useEffect(() => {
    if (fetchStatus) {
      setMergedState((prevState) => {
        return {
          ...prevState,
          posts: prevState.posts.map((post, i) => ({
            ...post,
            user: prevState.dataRandomUser[i],
          })),
        };
      });
    }
  }, [fetchStatus, mergedState?.dataRandomUser]);

  useEffect(() => {
    if (mergedState && fetchStatus) {
      setLastElement(mergedState.posts[mergedState.posts.length - 1]);
    }
  }, [fetchStatus, mergedState, mergedState?.posts]);

  // FLAG WHICH TELLS, 100 POSTS || 20 USERS ARE FETCHED OR IS FETCHING
  // THIS IS REQUIERED 'CAUSE IF THE RAW STATEMENT WILL BE USED IN THE
  // USE EFFECT WITH urlDepsValues VALUES IN STATEMENT WILL BE DIFFERENT ON
  // ANOTHER RENDER WHEN CONDITION IS MET, SO THE POSTS WILL BE JUST
  // INCREMENTED BY 5 AND 1 SO THE RANDOMIZATION ON EACH REDENR WILL BE BROKEN

  useEffect(() => {
    if (fetchCountValue >= 100 || pageNumberValue >= 21) {
      setBeenFullRequested(true);
    }
  }, [fetchCountValue, pageNumberValue]);

  // SETS URL DEPS VALUES, AND MAKES IT STATEFULL
  // THIS IS DIFFERENT 'CAUSE THIS IS JUST THE VALUE

  useEffect(() => {
    // IF (INTERSECTING) -> FETCH CALL WILL BE PERFORMED
    if (intersecting) {
      console.log(intersecting);
      setFetchNextPosts(true);
      setUrlDepsValues((prevState) => {
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
          rootMargin: "300px",
          threshold: 0,
        };

        // ON EACH FETCH CALL DIFFERENT IntersectionObserver ARE CREATED
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
          if (post.isIntersecting) {
            setUrlDeps({
              fetchCount: fetchCountValue,
              pageNumber: pageNumberValue,
            });
          }
          createdObserver.unobserve(post.target);
          createdObserver.disconnect();
        }, options);

        createdObserver.observe(observer.current);
      }
    }
  }, [fetchCountValue, fetchStatus, lastElement, pageNumberValue]);

  // HOOK WHICH RETURNS WIDTH AND HEIGHT FOR CURRENT VIEWPORT
  const windowDimensions = useWindowDimensions();

  // REDIRECT TO /POSTS ON MOUNT

  // useEffect(() => {
  //   navigate("/posts");
  // }, []);

  // SAVE STATE TO LocalStorage
  // useEffect(() => {
  //   if (mergedState && fetchStatus) {
  //     localStorage.setItem("mergedState", JSON.stringify(mergedState));
  //   }
  // }, [fetchStatus, mergedState]);

  console.log(mergedState);

  return (
    <>
      <Header />
      <Outlet
        context={{
          mergedState,
          setMergedState,
          fetchStatus,
          loadingPosts,
          loadingRandomUser,
          observer,
          lastElement,
          windowDimensions,
        }}
      />
    </>
  );
};

export default App;
