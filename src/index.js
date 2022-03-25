import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import App from "./App";
import Home from "./Components/Home";
import Posts from "./Components/Posts";
import NoMatch from "./Components/NoMatch";
import CurrentPost from "./Components/CurrentPost";
import "./styles/index.scss";
const queryClient = new QueryClient();

render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Posts />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:postId" element={<CurrentPost />} />
          <Route path="home" element={<Home />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>,
  document.getElementById("root")
);
