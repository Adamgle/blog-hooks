import React from "react";
import Header from "./Components/Header";
import { Posts } from "./Components/Posts";

const App = () => {
  // STATE

  return (
    <>
      <Header />
      <div className="posts-container">
        <Posts />
      </div>
    </>
  );
};

export default App;

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { fa1 } from "@fortawesome/free-solid-svg-icons";
// const element = <FontAwesomeIcon icon={fa1} />;
