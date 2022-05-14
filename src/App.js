import { nanoid } from "nanoid";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Header from "./Components/Header";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "./Components/Hooks/useFetch";
import { sortByDate, sortPreviousState } from "./Components/utilities";

const App = () => {
  // STATE
  const [mergedState, setMergedState] = useState({
    initial: null,
    byDate: null,
  });
  const [fetchStatus, setFetchStatus] = useState(false);
  const [infiniteFetchingDeps, setInfiniteFetchingDeps] = useState({
    beenFullRequested: null,
    intersecting: false,
    startInfinityFetching: false,
    urlDepsChanged: false,
    urlDeps: {
      fetchCount: 0,
      pageNumber: 1,
    },
  });

  const [sortMethod, setSortMethod] = useState("initial");
  const [observedElements, setObservedElements] = useState([]);
  const [lastFivePosts, setLastFivePosts] = useState();

  // REFS
  const { current: usersSeed } = useRef("usersSeed");
  const beenDifferentThanInitial = useRef(false);
  const previousSortMethod = useRef(null);
  const postID = useRef(0);

  const navigate = useNavigate();
  const params = useParams();

  // DESTRUCTER infinteFetchingDeps SO THAT IT CAN BE EASILY ACCESSIBLE VIA ONE VAR NAME
  // WITH PERSISTENCE OF ONE OBJECT THAT HOLDS THE DATA
  const {
    beenFullRequested,
    intersecting,
    startInfinityFetching,
    urlDepsChanged,
    urlDeps,
  } = infiniteFetchingDeps;
  const { fetchCount, pageNumber } = urlDeps;

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
    const infiniteFetchingDeps = localStorage.getItem("infiniteFetchingDeps");

    if (data) {
      setMergedState(JSON.parse(data));
      setSortMethod(sortMethod);
      setInfiniteFetchingDeps({
        ...JSON.parse(infiniteFetchingDeps),
      });
    }
  }, []);

  // LOAD DATABASES
  useEffect(() => {
    if (fetchCount >= 100 || pageNumber >= 21) {
      return;
    }
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
    setInfiniteFetchingDeps((prevState) => ({
      ...prevState,
      urlDepsChanged: true,
    }));
  }, [dbPosts, dbRandomUser]);

  useEffect(() => {
    setInfiniteFetchingDeps((prevState) => ({
      ...prevState,
      intersecting: false,
    }));
  }, [dataPosts, dataRandomUser]);

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
    // "ELSE IF" IS PERFORMED FOR INFINITY SCROLLING,
    // WHEN USER GOES ALL THE WAY DOWN THE PAGE, ANOTHER 5 POSTS
    // WILL BE FETCHED AND STATUS WILL BE DIFFERENT
    if (!startInfinityFetching && !intersecting) {
      setMergedState((prevState) => {
        return fetchStatus
          ? {
              ...prevState,
              initial: {
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
                    user: dataRandomUser.results[i],
                  };
                }),
                dataRandomUser: dataRandomUser.results.map((user) => ({
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
        return !loadingPosts && !loadingRandomUser
          ? {
              ...prevState,
              initial: {
                ...prevState.initial,
                posts: [
                  ...prevState.initial.posts,
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
                      user: dataRandomUser.results[i],
                    };
                  }),
                ],
                dataRandomUser: [
                  ...prevState.initial?.dataRandomUser,
                  ...dataRandomUser.results.map((user) => ({
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
    dataRandomUser,
    loadingPosts,
    loadingRandomPicture,
    loadingRandomUser,
    intersecting,
    startInfinityFetching,
    urlDepsChanged,
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
            posts: prevState.initial.posts.map((post, i) => {
              return {
                ...post,
                user: prevState.initial.dataRandomUser[i],
              };
            }),
          },
        };
      });
    }
    //
  }, [fetchStatus, mergedState.initial?.dataRandomUser]);

  // SETS THE OBSERVER TO LAST 5 POSTS ON THE PAGE
  useEffect(() => {
    if (!loadingPosts && !loadingRandomUser) {
      if (mergedState[sortMethod] && fetchStatus) {
        const postsLength = mergedState[sortMethod].posts.length;
        setLastFivePosts(mergedState[sortMethod].posts.slice(postsLength - 5));
      }
    }
  }, [fetchStatus, mergedState, sortMethod, loadingPosts, loadingRandomUser]);

  // FLAG WHICH TELLS, 100 POSTS || 20 USERS ARE FETCHED OR IS FETCHING
  // THIS IS REQUIERED 'CAUSE IF THE RAW STATEMENT WILL BE USED IN THE
  // USE EFFECT WITH urlDepsValues VALUES IN STATEMENT WILL BE DIFFERENT ON
  // ANOTHER RENDER WHEN CONDITION IS MET, SO THE POSTS WILL BE JUST
  // INCREMENTED BY 5 AND 1 SO THE RANDOMIZATION ON EACH RENDER WILL BE BROKEN

  useEffect(() => {
    if (fetchCount >= 100 || pageNumber >= 21) {
      setInfiniteFetchingDeps((prevState) => ({
        ...prevState,
        beenFullRequested: true,
      }));
    }
  }, [fetchCount, pageNumber]);

  // MOUNTS IntersectionObserver ATTACHED TO LAST FIVE ITEMS ON THE PAGE

  useEffect(() => {
    if (intersecting) {
      setInfiniteFetchingDeps((prevState) =>
        beenFullRequested
          ? {
              ...prevState,
              urlDeps: {
                fetchCount: Math.trunc(Math.random() * 95),
                pageNumber: Math.trunc(Math.random() * 20),
              },
            }
          : {
              ...prevState,
              startInfinityFetching: true,
              urlDeps: {
                fetchCount: prevState.urlDeps.fetchCount + 5,
                pageNumber: prevState.urlDeps.pageNumber + 1,
              },
            }
      );
    }
  }, [beenFullRequested, intersecting]);

  console.log(observedElements);

  useEffect(() => {
    if (
      fetchStatus &&
      observedElements.length === 5 &&
      observedElements[0].current &&
      !loadingPosts &&
      !loadingRandomUser
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
      observedElements.forEach((post) => {
        createdObserver.observe(post.current);
      });
    }
  }, [fetchStatus, observedElements, loadingPosts, loadingRandomUser]);

  // REDIRECT TO /POSTS ON MOUNT
  useEffect(() => {
    // TEMPORARY REDIRECT TO POSTS ON MOUNT
    // LATER IT WILL BE HOMEPAGE
    if (!Object.keys(params).length || params.mountParams !== "blog-hooks") {
      navigate("/blog-hooks/posts", { replace: true });
    }
  }, [navigate, params]);

  const memoizedSortedDate = useMemo(() => {
    if (mergedState.initial?.posts) {
      return sortByDate(mergedState.initial, true);
    }
  }, [mergedState.initial]);

  useEffect(() => {
    if (fetchStatus) {
      setMergedState((prevState) => {
        if (prevState.initial) {
          if (sortMethod !== "initial") {
            beenDifferentThanInitial.current = true;
            previousSortMethod.current = sortMethod;
          }
          return {
            ...prevState,
            [sortMethod]:
              sortMethod === "byDate"
                ? memoizedSortedDate
                : sortMethod === "initial"
                ? beenDifferentThanInitial.current
                  ? sortPreviousState(prevState, previousSortMethod.current)
                  : prevState[sortMethod]
                : prevState.initial,
          };
        }
        return prevState;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchStatus, sortMethod]);

  // SAVE STATE TO LocalStorage also fetchDeps
  useEffect(() => {
    if (mergedState && fetchStatus) {
      localStorage.setItem("mergedState", JSON.stringify(mergedState));
      localStorage.setItem("sortMethod", sortMethod);
      localStorage.setItem(
        "infiniteFetchingDeps",
        JSON.stringify(infiniteFetchingDeps)
      );
    }
  }, [fetchStatus, mergedState, sortMethod, infiniteFetchingDeps]);

  // console.log(mergedState[sortMethod]);
  console.log(
    mergedState[sortMethod]?.posts
      .map((post, i) => ((i + 1) % 5 === 0 ? post.fetchedID : null))
      .filter(Boolean)
  );
  // console.log(mergedState[sortMethod]?.posts.map((post) => post.postID));

  // console.log(mergedState[sortMethod]?.posts.map((post) => post.fetchedID));

  // console.log(fetchCount, pageNumber);

  return (
    <>
      <Header />
      <Outlet
        context={{
          mergedState: mergedState[sortMethod],
          setMergedState,
          sortMethod,
          setSortMethod,
          fetchStatus,
          loadingPosts,
          loadingRandomUser,
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
