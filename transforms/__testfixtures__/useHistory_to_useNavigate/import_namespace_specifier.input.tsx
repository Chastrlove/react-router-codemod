import * as Router from "react-router-dom"
import React from "react"

let c = Router

function App() {
  const { go, goBack, goForward, push: push2, replace } = Router.useHistory()

  const goForwardFn = React.useCallback(() => {
    goForward()
  }, [goForward])

  const pushFn = React.useCallback(() => {
    push2("/anme1", { id: 13 })
  }, [push2])

  return (
    <>
      <button onClick={() => replace("name", { id: 123 })}>replace</button>
      <button onClick={goBack}>Go back</button>
      <button onClick={goForward}>Go forward</button>
      <button onClick={goForwardFn}>Go forward useCallback</button>
      <button onClick={() => goForward()}>Go forward</button>
      <button onClick={() => push2("/anme1")}>push</button>
      <button onClick={() => push2("/anme1", { id: 13 })}>push state</button>
      <button onClick={pushFn}>push state useCallback</button>
      <button onClick={() => go(-2)}>Go -2 pages</button>
    </>
  )
}
