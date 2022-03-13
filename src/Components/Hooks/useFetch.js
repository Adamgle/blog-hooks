import { useEffect, useState } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (url) {
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          setData(res);
          setLoading(false);
          return res;
        });
    }
    return () => {
      setLoading(false);
    };
  }, [url]);

  return { data, loading };
};
