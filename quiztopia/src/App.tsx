import React from "react";
import "./App.css";
import SignUp from "./User/SignUp";
import Login from "./User/Login";
import CreateQuiz from "./Features/CreateQuiz";
import ViewAll from "./Features/ViewAll";
import Map from "./Features/Map";

function App() {
  return (
    <div className="app-container">
      <SignUp />
      <Login />
      <CreateQuiz />
      <Map />
      <ViewAll />
    </div>
  );
}

export default App;
