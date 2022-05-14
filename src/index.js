import { render } from "react-dom";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import App from "./App";
import Home from "./Components/Home";
import Posts from "./Components/Posts";
import NoMatch from "./Components/NoMatch";
import Post from "./Components/Post";
import "./styles/index.scss";
import React from "react";

render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path=":mountParams" element={<App />}>
        <Route index element={<Posts />} />
        <Route path="posts" element={<Posts />}>
          <Route index element={<Post />} />
          <Route path=":postId" element={<Post />} />
        </Route>
        <Route path="home" element={<Home />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);
