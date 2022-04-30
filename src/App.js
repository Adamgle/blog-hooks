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
    fetchNextPosts: false,
    changeUrlValues: false,
    urlDeps: {
      fetchCount: 0,
      pageNumber: 1,
    },
    urlDepsValues: {
      fetchCountValue: 0,
      pageNumberValue: 1,
    },
  });

  const [counter, setCounter] = useState(0);

  // LAST POST
  const [lastElement, setLastElement] = useState(null);

  const [sortMethod, setSortMethod] = useState("initial");

  // REFS
  const observer = useRef(null);
  const { current: usersSeed } = useRef("usersSeed");

  const navigate = useNavigate();
  const params = useParams();

  // DESTRUCTER infinteFetchingDeps SO THAT IT CAN BE EASILY ACCESSIBLE VIA ONE VAR NAME
  // WITH PERSISTENCE OF ONE OBJECT THAT HOLDS THE DATA
  const {
    beenFullRequested,
    intersecting,
    fetchNextPosts,
    changeUrlValues,
    urlDeps,
    urlDepsValues,
  } = infiniteFetchingDeps;
  const { fetchCount, pageNumber } = urlDeps;
  const { fetchCountValue, pageNumberValue } = urlDepsValues;

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
      // SET fetchNextPosts TO FALSE ON MOUNT, SO THAT STALE DATA
      // WON'T BE SPREAD TO STATE
      setInfiniteFetchingDeps({
        ...JSON.parse(infiniteFetchingDeps),
        fetchNextPosts: false,
      });
    }
  }, []);

  // LOAD DATABASES
  useEffect(() => {
    if (
      fetchCount !== fetchCountValue ||
      pageNumber !== pageNumberValue ||
      !changeUrlValues
    ) {
      return;
    }

    if (
      fetchCount === fetchCountValue &&
      pageNumber === pageNumberValue &&
      changeUrlValues
    ) {
      setDbPosts(
        `https://jsonplaceholder.typicode.com/posts?_start=${fetchCount}&_limit=5`
      );
      setDbRandomUser(
        `https://randomuser.me/api/?page=${pageNumber}&results=5&seed=${usersSeed}`
      );
    }
  }, [
    fetchCount,
    fetchCountValue,
    pageNumber,
    pageNumberValue,
    usersSeed,
    changeUrlValues,
  ]);

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
  // let mockId = 0;
  let postID = useRef(0);

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
                    ]
                  : prevState.initial.posts
                : dataPosts.map((post, i) => {
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
      // setBeenFullRequested(true);
      setInfiniteFetchingDeps((prevState) => ({
        ...prevState,
        beenFullRequested: true,
      }));
    }
  }, [fetchCountValue, pageNumberValue]);

  // SETS URL DEPS VALUES, AND MAKES IT STATEFULL
  // THIS IS DIFFERENT 'CAUSE THIS IS JUST THE VALUE
  useEffect(() => {
    // IF (INTERSECTING) -> FETCH CALL WILL BE PERFORMED
    if (intersecting) {
      setInfiniteFetchingDeps((prevState) => {
        if (beenFullRequested) {
          return {
            ...prevState,
            changeUrlValues: false,
            urlDepsValues: {
              fetchCountValue: Math.trunc(Math.random() * 95),
              pageNumberValue: Math.trunc(Math.random() * 20),
            },
          };
        }
        return {
          ...prevState,
          fetchNextPosts: true,
          changeUrlValues: false,
          urlDepsValues: {
            fetchCountValue:
              prevState.urlDeps.fetchCount + 5 ===
              prevState.urlDepsValues.fetchCountValue + 5
                ? prevState.urlDepsValues.fetchCountValue + 5
                : prevState.urlDeps.fetchCount + 5,
            pageNumberValue:
              prevState.urlDeps.pageNumber + 1 ===
              prevState.urlDepsValues.pageNumberValue + 1
                ? prevState.urlDepsValues.pageNumberValue + 1
                : prevState.urlDeps.pageNumber + 5,
          },
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
          rootMargin: "0px",
          threshold: 0,
        };

        // ON EACH FETCH CALL DIFFERENT IntersectionObserver ARE CREATED
        const createdObserver = new IntersectionObserver((entries) => {
          console.log(entries);
          const post = entries[0];
          setInfiniteFetchingDeps((prevState) => ({
            ...prevState,
            intersecting: post.isIntersecting,
          }));
          if (
            !post.isIntersecting ||
            fetchCountValue >= 100 ||
            pageNumberValue >= 21
          ) {
            return;
          }
          if (post.isIntersecting) {
            setInfiniteFetchingDeps((prevState) => ({
              ...prevState,
              urlDeps: {
                fetchCount: fetchCountValue,
                pageNumber: pageNumberValue,
              },
              changeUrlValues: true,
            }));
          }
          if (post.isIntersecting) {
            createdObserver.unobserve(post.target);
            createdObserver.disconnect();
          }
        }, options);

        createdObserver.observe(observer.current);
      }
    }
  }, [
    fetchCount,
    fetchCountValue,
    fetchStatus,
    lastElement,
    pageNumber,
    pageNumberValue,
  ]);

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

  const beenDifferentThanInitial = useRef(false);
  const previousSortMethod = useRef(null);

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
  }, [fetchStatus, sortMethod]);

  console.log(observer);

  // useEffect(() => {
  //   if (sortMethod !== "initial") {
  //     setMergedState((prevState) => ({
  //       ...prevState,
  //       posts: prevState[sortMethod]
  //     }))
  //   }
  // }, [sortMethod])

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

  // console.log(mergedState[sortMethod]?.posts.map((post) => post.postID));

  // const [observedElement, setObservedElement] = useState(Array(5).fill(null));

  if (
    !localStorage.getItem("sortMethod") ||
    !localStorage.getItem("infiniteFetchingDeps")
  ) {
    localStorage.clear();
  }

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
          observer,
          lastElement,
          intersecting,
        }}
      />
    </>
  );
};

export default App;
