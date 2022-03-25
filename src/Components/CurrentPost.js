import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";

const CurrentPost = () => {
  const [currentPost, setCurrentPost] = useState(null);
  const [mergedState] = useOutletContext();
  const params = useParams();

  useEffect(() => {
    if (mergedState?.posts) {
      setCurrentPost(
        mergedState.posts.find((post) => post.id === params.postId)
      );
    }
  }, [mergedState, params.postId]);
  console.log(currentPost);
  return <div>New Post</div>;
};

export default CurrentPost;
