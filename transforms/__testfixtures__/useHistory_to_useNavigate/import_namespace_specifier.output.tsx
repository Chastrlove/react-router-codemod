import * as Router from "react-router-dom"
import React from "react"

//fixme don't support
let c = Router;

function App() {
  const navigate = Router.useNavigate()

  const goForwardFn = React.useCallback(() => {
    navigate(1)
  }, [navigate])

  const pushFn = React.useCallback(() => {
    navigate("/anme1", {
      state: { id: 13 }
    })
  }, [navigate])

  return <>
    <button onClick={() => navigate("name", {
      replace: true,
      state: { id: 123 }
    })}>replace</button>
    <button onClick={//fixme binding by yourself
    goBack}>Go back</button>
    <button onClick={//fixme binding by yourself
    goForward}>Go forward</button>
    <button onClick={goForwardFn}>Go forward useCallback</button>
    <button onClick={() => navigate(1)}>Go forward</button>
    <button onClick={() => navigate("/anme1")}>push</button>
    <button onClick={() => navigate("/anme1", {
      state: { id: 13 }
    })}>push state</button>
    <button onClick={pushFn}>push state useCallback</button>
    <button onClick={() => navigate(-2)}>Go -2 pages</button>
  </>;
}
