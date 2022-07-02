import { nanoid } from "nanoid";
import React, { useState, useEffect, useRef } from "react";
import Header from "./Components/Header";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "./Components/Hooks/useFetch";
import { sortByDate } from "./Components/utilities";
import { sortPreviousState } from "./Components/utilities";

const App = () => {
  // STATE
  const [mergedState, setMergedState] = useState({
    initial: null,
  });
  const [fetchStatus, setFetchStatus] = useState(false);
  const [infiniteFetchingDeps, setInfiniteFetchingDeps] = useState({
    beenFullRequested: null,
    intersecting: false,
    startInfinityFetching: false,
    urlDepsChanged: false,
    lastFivePosts: [],
    urlDeps: {
      urlPostsValue: 0,
      urlUserValue: 1,
    },
  });

  const [sortMethod, setSortMethod] = useState("initial");
  const [observedElements, setObservedElements] = useState([]);

  // REFS
  const { current: usersSeed } = useRef("usersSeed");
  const postID = useRef(0);
  const beenSorted = useRef(false);

  // HOOKS
  const navigate = useNavigate();
  const params = useParams();

  // DESTRUCTER infinteFetchingDeps SO THAT IT CAN BE EASILY ACCESSIBLE VIA ONE VAR NAME
  // WITH PERSISTENCE OF ONE OBJECT THAT HOLDS THE DATA
  const {
    beenFullRequested,
    intersecting,
    startInfinityFetching,
    lastFivePosts,
    urlDepsChanged,
    urlDeps,
  } = infiniteFetchingDeps;
  const { urlPostsValue, urlUserValue } = urlDeps;

  const [stateContainerName, setStateContainerName] = useState("initial");

  // SETTING STORAGE TO STATE
  useEffect(() => {
    const data = localStorage.getItem("mergedState");
    const sortMethod = localStorage.getItem("sortMethod");
    const infiniteFetchingDeps = localStorage.getItem("infiniteFetchingDeps");
    const postIDStorage = +localStorage.getItem("postID");
    if (data) {
      setMergedState(JSON.parse(data));
      setSortMethod(sortMethod);
      setInfiniteFetchingDeps({
        ...JSON.parse(infiniteFetchingDeps),
      });
      postID.current = postIDStorage;
    }
  }, []);

  useEffect(() => {
    setStateContainerName(sortMethod !== "initial" ? "sorted" : "initial");
  }, [sortMethod]);

  // DB'S
  const [dbPosts, setDbPosts] = useState(
    `https://jsonplaceholder.typicode.com/posts?_start=${urlPostsValue}&_limit=5`
  );
  const [dbUsers, setDbUsers] = useState(
    `https://randomuser.me/api/?page=${urlUserValue}&results=5&seed=${usersSeed}`
  );
  const [dbRandomPicture] = useState(
    `https://picsum.photos/v2/list?page=2&limit=100`
  );

  // FETCH CALLS
  const { data: dataPosts, loading: loadingPosts } = useFetch(dbPosts);
  const { data: dataUsers, loading: loadingUsers } = useFetch(dbUsers);
  const { data: dataRandomPicture, loading: loadingRandomPicture } =
    useFetch(dbRandomPicture);

  // LOAD DATABASES
  useEffect(() => {
    if (urlPostsValue >= 100 || urlUserValue >= 21) {
      return;
    }
    if (!loadingPosts && !loadingUsers) {
      setDbPosts(
        `https://jsonplaceholder.typicode.com/posts?_start=${urlPostsValue}&_limit=5`
      );
      setDbUsers(
        `https://randomuser.me/api/?page=${urlUserValue}&results=5&seed=${usersSeed}`
      );
    }
  }, [urlPostsValue, urlUserValue, usersSeed, loadingPosts, loadingUsers]);

  useEffect(() => {
    setInfiniteFetchingDeps((prevState) => ({
      ...prevState,
      urlDepsChanged: true,
    }));
  }, [dbPosts, dbUsers]);

  useEffect(() => {
    setInfiniteFetchingDeps((prevState) => ({
      ...prevState,
      intersecting: false,
    }));
  }, [dataPosts, dataUsers]);

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
      !loadingUsers &&
      !loadingRandomPicture &&
      dataPosts &&
      dataUsers?.results.length &&
      dataRandomPicture
    ) {
      setFetchStatus(true);
    }
  }, [
    loadingPosts,
    loadingUsers,
    loadingRandomPicture,
    dataPosts,
    dataUsers,
    dataRandomPicture,
  ]);

  // MERGE DATA FROM FETCH CALLS TO ONE STATEFULL OBJECT TYPE VALUE
  useEffect(() => {
    // "ELSE IF" IS PERFORMED FOR INFINITY SCROLLING,
    // WHEN USER GOES ALL THE WAY DOWN THE PAGE, ANOTHER 5 POSTS
    // WILL BE FETCHED AND STATUS WILL BE DIFFERENT
    if (
      loadingPosts ||
      loadingUsers ||
      loadingRandomPicture ||
      !dataPosts ||
      !dataUsers ||
      !dataRandomPicture
    ) {
      return;
    }
    if (!startInfinityFetching && !intersecting) {
      setMergedState((prevState) => {
        return fetchStatus
          ? {
              ...prevState,
              [stateContainerName]: {
                posts: dataPosts.map((post, i) => {
                  postID.current += 1;
                  return {
                    ...post,
                    postID: postID.current,
                    fetchedID: post.id,
                    id: nanoid(),
                    comments: {},
                    likes: 0,
                    isRead: false,
                    user: dataUsers.results[i],
                  };
                }),
                dataUsers: dataUsers.results.map((user) => ({
                  ...user,
                  id: nanoid(),
                  name: {
                    ...user.name,
                    fullName: `${user.name.first} ${user.name.last}`,
                  },
                })),
                dataRandomPicture: dataRandomPicture.map((e) => {
                  return {
                    ...e,
                    download_url:
                      e.download_url
                        .split("/")
                        .slice(0, e.download_url.split("/").length - 2)
                        .join("/") + "/760/400",
                  };
                }),
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
                  isAdmin: false,
                },
              },
            }
          : prevState;
      });
      setInfiniteFetchingDeps((prevState) => ({
        ...prevState,
        urlDepsChanged: false,
      }));
    } else if (startInfinityFetching && intersecting && urlDepsChanged) {
      setMergedState((prevState) => {
        return !loadingPosts && !loadingUsers
          ? {
              ...prevState,
              [stateContainerName]: {
                ...prevState[stateContainerName],
                posts: [
                  ...prevState[stateContainerName].posts,
                  ...dataPosts.map((post, i) => {
                    postID.current += 1;
                    return {
                      ...post,
                      postID: postID.current,
                      fetchedID: post.id,
                      id: nanoid(),
                      comments: {},
                      likes: 0,
                      isRead: false,
                      user: dataUsers.results[i],
                    };
                  }),
                ],
                dataUsers: [
                  ...prevState[stateContainerName]?.dataUsers,
                  ...dataUsers.results.map((user) => ({
                    ...user,
                    id: nanoid(),
                    name: {
                      ...user.name,
                      fullName: `${user.name.first} ${user.name.last}`,
                    },
                  })),
                ],
              },
            }
          : prevState;
      });
    }
  }, [
    fetchStatus,
    dataPosts,
    dataRandomPicture,
    dataUsers,
    loadingPosts,
    loadingRandomPicture,
    loadingUsers,
    intersecting,
    startInfinityFetching,
    urlDepsChanged,
    stateContainerName,
  ]);

  // ADD USER ENTRY TO POSTS PROPERTY SO IT CAN BE ACCESSIBLE
  // THROUGH ONE PROP "mergedState.posts"
  useEffect(() => {
    if (fetchStatus) {
      const oppositeContainerName =
        stateContainerName === "initial" ? "sorted" : "initial";
      setMergedState((prevState) => {
        return {
          ...prevState,
          [stateContainerName]: {
            ...prevState[stateContainerName],
            posts: prevState[stateContainerName].posts.map((post, i) => {
              if (prevState.hasOwnProperty(oppositeContainerName)) {
                const oppositeStatePostsIds = prevState[
                  oppositeContainerName
                ].posts.map((post) => post.postID);

                return oppositeStatePostsIds.includes(post.postID)
                  ? post
                  : {
                      ...post,
                      user: prevState[stateContainerName].dataUsers[i],
                    };
              }

              return {
                ...post,
                user: prevState[stateContainerName].dataUsers[i],
              };
            }),
          },
        };
      });
    }
    //
  }, [fetchStatus, dataUsers, stateContainerName]);

  // SETS THE OBSERVER TO LAST 5 POSTS ON THE PAGE
  useEffect(() => {
    if (!loadingPosts && !loadingUsers) {
      if (mergedState[stateContainerName] && fetchStatus) {
        const postsLength = mergedState[stateContainerName].posts.length;
        setInfiniteFetchingDeps((prevState) => ({
          ...prevState,
          lastFivePosts: mergedState[stateContainerName].posts.slice(
            postsLength - 5
          ),
        }));
      }
    }
  }, [
    fetchStatus,
    mergedState,
    stateContainerName,
    loadingPosts,
    loadingUsers,
  ]);

  useEffect(() => {
    if (urlPostsValue >= 100 || urlUserValue >= 21) {
      setInfiniteFetchingDeps((prevState) => ({
        ...prevState,
        beenFullRequested: true,
      }));
    }
  }, [urlPostsValue, urlUserValue]);

  // MOUNTS IntersectionObserver ATTACHED TO LAST FIVE ITEMS ON THE PAGE
  useEffect(() => {
    if (intersecting && !loadingPosts && !loadingUsers) {
      setInfiniteFetchingDeps((prevState) =>
        beenFullRequested
          ? {
              ...prevState,
              urlDeps: {
                urlPostsValue: Math.trunc(Math.random() * 95),
                urlUserValue: Math.trunc(Math.random() * 20),
              },
            }
          : {
              ...prevState,
              startInfinityFetching: true,
              urlDeps: {
                urlPostsValue: prevState.urlDeps.urlPostsValue + 5,
                urlUserValue: prevState.urlDeps.urlUserValue + 1,
              },
            }
      );
    }
  }, [beenFullRequested, intersecting, loadingPosts, loadingUsers]);

  useEffect(() => {
    if (
      // sortMethod === "initial" &&
      observedElements.length === 5 &&
      observedElements[0].current &&
      !loadingPosts &&
      !loadingUsers
    ) {
      // ON EACH FETCH CALL DIFFERENT IntersectionObserver ARE CREATED
      const createdObserver = new IntersectionObserver(
        (entries) => {
          const isPostIntersecting = entries.some(
            (post) => post.isIntersecting === true
          );

          setInfiniteFetchingDeps((prevState) => ({
            ...prevState,
            intersecting: isPostIntersecting,
          }));

          if (!isPostIntersecting) {
            return;
          }
          entries.forEach((post) => {
            createdObserver.unobserve(post.target);
          });
          createdObserver.disconnect();
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0,
        }
      );
      // if (sortMethod === "initial") {
      observedElements.forEach((post) => {
        if (post.current && typeof post.current === "object")
          createdObserver.observe(post.current);
      });
      // }
    }
  }, [observedElements, loadingPosts, loadingUsers, sortMethod]);

  // REDIRECT TO /POSTS ON MOUNT
  useEffect(() => {
    // TEMPORARY REDIRECT TO POSTS ON MOUNT
    // LATER IT WILL BE HOMEPAGE
    if (!Object.keys(params).length || params.mountParams !== "blog-hooks") {
      navigate("/blog-hooks/posts", { replace: true });
    }
  }, [navigate, params]);

  useEffect(() => {
    if (fetchStatus) {
      setMergedState((prevState) => {
        if (prevState.initial && prevState.initial.posts) {
          const sortedState = sortByDate(
            sortMethod !== "initial"
              ? sortPreviousState(prevState[stateContainerName])
              : prevState.initial,
            true,
            sortMethod === "byDateLatest"
              ? true
              : sortMethod === "byDateOldest" && false
          );

          if (sortMethod !== "initial") beenSorted.current = true;

          return sortMethod === "initial"
            ? {
                ...prevState,
                initial: beenSorted.current
                  ? sortPreviousState(prevState[stateContainerName])
                  : prevState.initial,
              }
            : {
                ...prevState,
                sorted: sortedState,
              };
        }
        return prevState;
      });
    }
  }, [fetchStatus, sortMethod, stateContainerName]);

  // SAVE STATE TO LocalStorage also fetchDeps
  useEffect(() => {
    if (mergedState[stateContainerName] && fetchStatus) {
      localStorage.setItem("mergedState", JSON.stringify(mergedState));
      localStorage.setItem("sortMethod", sortMethod);
      localStorage.setItem(
        "infiniteFetchingDeps",
        JSON.stringify(infiniteFetchingDeps)
      );
      localStorage.setItem("postID", postID.current);
    }
  }, [
    fetchStatus,
    mergedState,
    sortMethod,
    stateContainerName,
    infiniteFetchingDeps,
  ]);

  // TESTING TESTING TESTING TESTING TESTING TESTING `TESTING TESTING TESTING

  console.log(mergedState);

  return (
    <>
      <Header sortMethod={sortMethod} setSortMethod={setSortMethod} />
      <Outlet
        context={{
          mergedState: mergedState[stateContainerName],
          setMergedState,
          sortMethod: stateContainerName,
          setSortMethod,
          fetchStatus,
          loadingPosts,
          loadingUsers,
          intersecting,
          observedElements,
          setObservedElements,
          lastFivePosts,
        }}
      />
    </>
  );
};

export default App;
