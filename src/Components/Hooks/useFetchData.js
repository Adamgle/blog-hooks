import React, { useState } from "react";
import { useFetch } from "./useFetch";

const useFetchData = () => {
  const [usersCount, setUsersCount] = useState(10);

  // DB'S
  const dbUsers = `https://jsonplaceholder.typicode.com/posts/?_limit=${usersCount}`;
  const dbRandomUser = `https://randomuser.me/api/?results=${usersCount}&noinfo`;
  const dbRandomPicture = `https://picsum.photos/v2/list?page=2&limit=100`;

  // FETCH CALLS
  const { data: dataPosts, loading: loadingPosts } = useFetch(dbUsers);
  const { data: dataRandomUser, loading: loadingRandomUser } =
    useFetch(dbRandomUser);
  const { data: dataRandomPicture, loading: loadingRandomPicture } =
    useFetch(dbRandomPicture);

  return !loadingPosts && !loadingRandomPicture && !loadingRandomUser
    ? {
        posts: dataPosts,
        users: dataRandomUser,
        pictures: dataRandomPicture,
      }
    : null;
};

export default useFetchData;
