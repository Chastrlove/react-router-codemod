import React from "react";
import * as Router from "react-router-dom";

function App() {
  const history = Router.useHistory();
  return (
    <>
      <button onClick={() => history.replace("name", { id: 123 })}>replace</button>
      <button onClick={history.goBack}>Go back</button>
      <button onClick={history.goForward}>Go forward</button>
      <button onClick={() => history.goForward()}>Go forward</button>
      <button onClick={() => history.push("/anme1")}>push</button>
      <button onClick={() => history.push("/anme1", { id: 13 })}>push state</button>
      <button onClick={() => history.go(-2)}>Go -2 pages</button>
    </>
  );
}
