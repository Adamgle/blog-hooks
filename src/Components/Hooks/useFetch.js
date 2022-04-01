import { useEffect, useState } from "react";

export const useFetch = (url) => {
  const [{ data, loading }, setState] = useState({
    data: null,
    loading: true,
    cancel: false,
  });

  useEffect(() => {
    if (url) {
      setState((state) => ({ data: state.data, loading: true }));
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          setState({ data: res, loading: false });
          return res;
        })
        .catch((res) => {
          console.error("Failed to fetch", url);
        });
    }

    return () => {
      setState((prevState) => ({ data: prevState.data, loading: false }));
    };
  }, [url, setState]);

  return { data, loading };
};
