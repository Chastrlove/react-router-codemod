import React from "react";
import * as Router from "react-router-dom";

function App() {
  const navigate = Router.useNavigate();

  const goForwardFn = React.useCallback(() => {
    navigate(1)
  }, [navigate])

  const pushFn = React.useCallback(() => {
    navigate("/user", {
      state: { id: 13 }
    })
  }, [navigate])

  return <>
    <button onClick={() => navigate("name", {
      replace: true,
      state: { id: 123 }
    })}>replace</button>
    <button onClick={//fixme binding by yourself
    history.goBack}>Go back</button>
    <button onClick={//fixme binding by yourself
    history.goForward}>Go forward</button>
    <button onClick={goForwardFn}>Go forwardFn</button>
    <button onClick={() => navigate(1)}>Go forward</button>
    <button onClick={() => navigate("/user1")}>push</button>
    <button onClick={pushFn}>pushFn</button>
    <button onClick={() => navigate("/user2", {
      state: { id: 13 }
    })}>push state</button>
    <button onClick={() => navigate(-2)}>Go -2 pages</button>
  </>;
}
