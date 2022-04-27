import { nanoid } from "nanoid";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "./Components/Header";
import useWindowDimensions from "./Components/Hooks/useWindowDimensions";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "./Components/Hooks/useFetch";
import { sortByDate } from "./Components/_parsingFunctions";

const App = () => {
  // STATE
  const [mergedState, setMergedState] = useState({
    initial: null,
    byDate: null,
  });
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

  const [sortMethod, setSortMethod] = useState("initial");
  const [sorted, setSorted] = useState({
    initial: null,
    byDate: null,
  });

  const navigate = useNavigate();
  const params = useParams();

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
  useEffect(() => {
    const data = localStorage.getItem("mergedState");
    const sortMethod = localStorage.getItem("sortMethod");
    if (data) {
      setMergedState(JSON.parse(data));
      setSortMethod(sortMethod);
    }
  }, []);

  // LOAD DATABASES
  useEffect(() => {
    if (fetchCount !== fetchCountValue || pageNumber !== pageNumberValue) {
      return;
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

  // DETERMINE FETCH STATUS
  useEffect(() => {
    // IF NOT LOADING THEN SET FETCH STATUS TO TRUE
    // FETCH STATUS ARE CHANGING ONLY ONCE, THEN IT'S ALWAYS SET TO TRUE
    if (localStorage.getItem("mergedState")) {
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
            ...prevState,
            initial: {
              posts: prevState.initial?.posts
                ? fetchNextPosts
                  ? [
                      ...prevState.initial.posts,
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
                  : prevState.initial.posts
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
              dataRandomUser: prevState.initial?.dataRandomUser
                ? fetchNextPosts
                  ? [
                      ...prevState.initial?.dataRandomUser,
                      ...dataRandomUser.results.map((user) => ({
                        ...user,
                        id: nanoid(),
                        name: {
                          ...user.name,
                          fullName: `${user.name.first} ${user.name.last}`,
                        },
                      })),
                    ]
                  : prevState.initial.dataRandomUser
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
            },
          };
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchStatus,
    dataPosts,
    dataRandomPicture,
    dataRandomUser,
    loadingPosts,
    loadingRandomPicture,
    loadingRandomUser,
  ]);

  // ADD USER ENTRY TO POSTS PROPERTY SO IT CAN BE ACCESSIBLE
  // THROUGH ONE PROP "mergedState.posts"
  useEffect(() => {
    if (fetchStatus) {
      setMergedState((prevState) => {
        return {
          ...prevState,
          initial: {
            ...prevState.initial,
            posts: prevState.initial.posts.map((post, i) => ({
              ...post,
              user: prevState.initial.dataRandomUser[i],
            })),
          },
        };
      });
    }
    //
  }, [fetchStatus, mergedState.initial?.dataRandomUser]);

  // SETS THE OBSERVER TO LAST POST ON THE PAGE
  useEffect(() => {
    if (mergedState.initial && fetchStatus) {
      if (mergedState[sortMethod]) {
        const postsLength = mergedState[sortMethod].posts.length;
        setLastElement(mergedState[sortMethod].posts[postsLength - 1]);
      }
    }
    // [fetchStatus, mergedState[sortMethod], mergedState[sortMethod]?.posts]);
  }, [fetchStatus, mergedState, sortMethod]);

  // FLAG WHICH TELLS, 100 POSTS || 20 USERS ARE FETCHED OR IS FETCHING
  // THIS IS REQUIERED 'CAUSE IF THE RAW STATEMENT WILL BE USED IN THE
  // USE EFFECT WITH urlDepsValues VALUES IN STATEMENT WILL BE DIFFERENT ON
  // ANOTHER RENDER WHEN CONDITION IS MET, SO THE POSTS WILL BE JUST
  // INCREMENTED BY 5 AND 1 SO THE RANDOMIZATION ON EACH RENDER WILL BE BROKEN
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

  // MOUNTS AND IntersectionObserver ATTACHED TO
  // LAST ELEMENT ON THE PAGE
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

  useEffect(() => {
    // TEMPORARY REDIRECT TO POSTS ON MOUNT
    // LATER IT WILL BE HOMEPAGE
    if (!Object.keys(params).length || params.mountParams !== "blog-hooks") {
      navigate("/blog-hooks/posts", { replace: true });
    }
  }, []);

  // const handleSorting = useCallback(
  //   (state) => {
  //     console.log(state);
  //     if (state["initial"]?.posts) {
  //       console.log("Done Done Done Done Done Done Done Done Done ");
  //       return sortByDate(mergedState[sortMethod]);
  //     }
  //   },
  //   [sortMethod]
  // );

  useEffect(() => {
    if (fetchStatus) {
      setMergedState((prevState) => {
        console.log("done");
        console.log(prevState["initial"]);
        if (prevState["initial"]) {
          return {
            ...prevState,
            [sortMethod]:
              sortMethod === "byDate"
                ? {
                    ...prevState.initial,
                    posts: sortByDate(prevState["initial"]),
                  }
                : prevState[sortMethod],
          };
        }
        return prevState;
      });
    }
  }, [fetchStatus, sortMethod]);

  // SAVE STATE TO LocalStorage
  useEffect(() => {
    if (mergedState && fetchStatus) {
      localStorage.setItem("mergedState", JSON.stringify(mergedState));
      localStorage.setItem("sortMethod", sortMethod);
    }
  }, [fetchStatus, mergedState, sortMethod]);

  console.log(mergedState.initial);
  console.log(mergedState.byDate);
  console.log(intersecting);

  return (
    <>
      <Header />
      <Outlet
        context={{
          mergedState: mergedState[sortMethod],
          setMergedState,
          sorted,
          sortMethod,
          setSortMethod,
          fetchStatus,
          loadingPosts,
          loadingRandomUser,
          observer,
          lastElement,
          windowDimensions,
          intersecting,
        }}
      />
    </>
  );
};

export default App;
