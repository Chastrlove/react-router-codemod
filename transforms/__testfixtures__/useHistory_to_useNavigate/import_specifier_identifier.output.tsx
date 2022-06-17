import { useNavigate } from "react-router-dom";
import React from "react";

function App() {
  const navigate = useNavigate();
  return <>
    <button onClick={() => navigate("name", {
      replace: true,
      state: { id: 123 }
    })}>replace</button>
    <button onClick={//fixme 需手动binding
    history.goBack}>Go back</button>
    <button onClick={//fixme 需手动binding
    history.goForward}>Go forward</button>
    <button onClick={() => navigate(1)}>Go forward</button>
    <button onClick={() => navigate("/anme1")}>push</button>
    <button onClick={() => navigate("/anme1", {
      state: { id: 13 }
    })}>push state</button>
    <button onClick={() => navigate(-2)}>Go -2 pages</button>
  </>;
}
