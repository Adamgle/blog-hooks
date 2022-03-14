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
  // REF TO OBSERVER
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

  // console.log(dbPosts, fetchStatus);
  // console.log(dbRandomUser, fetchStatus);
  // console.log(dbRandomPicture, fetchStatus);
  console.log(mergedState);

  // FETCH CALLS
  const { data: dataPosts, loading: loadingPosts } = useFetch(dbPosts);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);
  const { data: dataRandomPicture, loading: loadingRandomPicture } =
    useFetch(dbRandomPicture);

  // console.log(dataPosts);
  // console.log(dataRandomUser);

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

  useEffect(() => {
    if (fetchStatus) {
      // dataPosts.slice(dataPosts.length - 5);
      // dataRandomUser.results.slice(dataRandomUser.results.length - 5);

      setReactiveDataPosts(dataPosts.slice(dataPosts.length - 5));
      setReactiveRandomUsers(
        dataRandomUser.results.slice(dataRandomUser.results.length - 5)
      );
    }
  }, [dataPosts, dataRandomUser]);

  console.log(reactiveDataPosts);
  console.log(reactiveRandomUsers);

  // MERGE DATA FROM FETCH CALLS TO ONE STATEFULL OBJECT TYPE VALUE
  useEffect(() => {
    // WAIT FOR ALL FETCH CALLS BE PROCCESSED

    if (fetchStatus) {
      // if (
      //   reactiveDataPosts &&
      //   reactiveRandomUsers &&
      //   reactiveDataPosts.length &&
      //   reactiveRandomUsers.length
      // ) {
      //   setMergedState((prevState) => {
      //     console.log("if");
      //     return {
      //       posts: [
      //         ...prevState.posts,
      //         ...reactiveDataPosts.map((post) => ({
      //           ...post,
      //           comments: {},
      //           likes: 0,
      //           isRead: false,
      //         })),
      //       ],
      //       dataRandomUser: [
      //         ...prevState.dataRandomUser,
      //         ...reactiveRandomUsers,
      //       ],
      //       dataRandomPicture: dataRandomPicture,
      //       dataProfile: {
      //         name: "Adam",
      //         image:
      //           "https://brokeinlondon.com/wp-content/uploads/2012/01/Facebook-no-profile-picture-icon-620x389.jpg",
      //         email: "adam.dev@gmail.com",
      //       },
      //       isAdmin: false,
      //     };
      //   });
      // } else {
      if (dataPosts.length !== dataRandomUser.results.length) {
        return;
      }
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
  }, [dataPosts, dataRandomUser]);

  // SHIT SHIT SHIT SHIT SHIT SHIT SHIT SHIT SHIT
  // useEffect(() => {
  //   if (fetchStatus) {
  //     if (
  //       reactiveDataPosts &&
  //       reactiveRandomUsers &&
  //       reactiveDataPosts.length &&
  //       reactiveRandomUsers.length
  //     ) {
  //       setMergedState((prevState) => {
  //         console.log("if");
  //         return {
  //           posts: [
  //             ...prevState.posts,
  //             ...reactiveDataPosts.map((post) => ({
  //               ...post,
  //               comments: {},
  //               likes: 0,
  //               isRead: false,
  //             })),
  //           ],
  //           dataRandomUser: [
  //             ...prevState.dataRandomUser,
  //             ...reactiveRandomUsers,
  //           ],
  //           dataRandomPicture: dataRandomPicture,
  //           dataProfile: {
  //             name: "Adam",
  //             image:
  //               "https://brokeinlondon.com/wp-content/uploads/2012/01/Facebook-no-profile-picture-icon-620x389.jpg",
  //             email: "adam.dev@gmail.com",
  //           },
  //           isAdmin: false,
  //         };
  //       });
  //     }
  //   }
  // }, [reactiveDataPosts, reactiveRandomUsers]);

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
    }
  }, [secondLastElement]);

  return (
    <div className="posts-container">
      <div className="posts">
        {loadingPosts ||
        loadingRandomUser ||
        loadingRandomPicture ||
        !mergedState ||
        !secondLastElement ||
        !reactiveDataPosts ||
        !reactiveRandomUsers
          ? "Loading..."
          : // dataPosts as State
            mergedState.posts.map((post, i) => {
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
        {fetchStatus && dataPosts.length !== dataRandomUser.results.length && (
          <div className="await">Fetching Data...</div>
        )}
      </div>
    </div>
  );
};

export default Posts;
