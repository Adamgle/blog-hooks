import React, { useEffect } from "react";
import {
  useOutletContext,
  Outlet,
  useParams,
  useNavigate,
} from "react-router-dom";

const Posts = () => {
  const {
    mergedState,
    setMergedState,
    sortMethod,
    fetchStatus,
    windowDimensions,
    intersecting,
    observedElements,
    setObservedElements,
    lastFivePosts,
    setPostsRefs,
  } = useOutletContext();

  // GET URL PARAMS
  const params = useParams();
  const navigate = useNavigate();
  // const [currentPost, setCurrentPost] = useState(null);

  const displayPosts = (
    <>
      {!fetchStatus || !mergedState ? (
        "Loading..."
      ) : (
        <>
          {mergedState.posts.map((post) => {
            return (
              <Outlet
                key={post.id}
                context={{
                  mergedState,
                  setMergedState,
                  sortMethod,
                  fetchStatus,
                  windowDimensions,
                  currentPost: post,
                  observedElements,
                  setObservedElements,
                  lastFivePosts,
                  setPostsRefs,
                }}
              />
            );
          })}
        </>
      )}
      {intersecting && <div className="await">Fetching Data...</div>}
    </>
  );

  const displayPost = mergedState?.posts.map((post) => {
    return post.id === params.postId ? (
      <Outlet
        key={post.id}
        context={{
          mergedState,
          setMergedState,
          sortMethod,
          fetchStatus,
          windowDimensions,
          currentPost: post,
          setPostsRefs,
        }}
      />
    ) : null;
  });

  // useEffect(() => {
  //   if (mergedState && fetchStatus) {
  //     setCurrentPost(
  //       () => mergedState?.posts.filter((post) => post.id === params.postId)[0]
  //     );
  //   }
  // }, [mergedState, fetchStatus, params.postId]);

  // BUG THERE
  // THIS useEffect CLEARS URL HISTORY
  useEffect(() => {
    if (mergedState && fetchStatus) {
      const postsIds = mergedState.posts.map((post) => post.id);
      if (
        params.mountParams === "blog-hooks" &&
        !postsIds.includes(params.postId)
      ) {
        navigate("/blog-hooks/posts", { replace: true });
      }
    }
  }, [fetchStatus, mergedState, navigate, params.mountParams, params.postId]);

  return (
    <div className={"posts-container"}>
      {params.postId ? (
        displayPost
      ) : (
        <div className="posts">{displayPosts}</div>
      )}
    </div>
  );
};

export default Posts;
