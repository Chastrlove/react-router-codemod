import React from "react";
import * as Router from "react-router-dom";

function App() {
  const history = Router.useHistory();

  const goForwardFn = React.useCallback(() => {
    history.goForward()
  }, [history])

  const pushFn = React.useCallback(() => {
    history.push("/user", { id: 13 })
  }, [history])

  return (
    <>
      <button onClick={() => history.replace("name", { id: 123 })}>replace</button>
      <button onClick={history.goBack}>Go back</button>
      <button onClick={history.goForward}>Go forward</button>
      <button onClick={goForwardFn}>Go forwardFn</button>
      <button onClick={() => history.goForward()}>Go forward</button>
      <button onClick={() => history.push("/user1")}>push</button>
      <button onClick={pushFn}>pushFn</button>
      <button onClick={() => history.push("/user2", { id: 13 })}>push state</button>
      <button onClick={() => history.go(-2)}>Go -2 pages</button>
    </>
  );
}
