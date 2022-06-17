
# React-Router v6 Codemod

A collection of codemod scripts that help upgrade react-router v6 using [jscodeshift](https://github.com/facebook/jscodeshift).(Inspired by [react-codemod](https://github.com/reactjs/react-codemod))

[![NPM version](https://img.shields.io/npm/v/react-router-codemod)](https://www.npmjs.com/package/react-router-codemod)
[![NPM downloads](https://img.shields.io/npm/dw/react-router-codemod)](https://www.npmjs.com/package/react-router-codemod)

## Usage

Before run codemod scripts, you'd better make sure to commit your local git changes firstly.

```shell
# global installation
npm i -g react-router-codemod
# or for yarn user
#  yarn global add react-router-codemod
react-router-codemod

# use npx
npx react-router-codemod
```

## Codemod scripts introduction

#### `useHistory_to_useNavigate`

Replace deprecated `useHistory`:

```diff
- import { useHistory } from "react-router-dom";
+ import { useNavigate } from "react-router-dom";
  import React from "react";

  function App() {
- const history = useHistory();
- const navigate = useNavigate();

  return (
    <>
-     <button onClick={() => history.replace("/name", { id: 123 })}>replace</button>
+     <button onClick={() => navigate("/name", {
+         replace: true,
+         state: { id: 123 }
+      })}>replace</button>
-     <button onClick={() => history.goForward()}>Go forward</button>
+     <button onClick={() => navigate(1)}>Go forward</button>
-     <button onClick={() => history.push("/user")}>push</button>
+     <button onClick={() => navigate("/user")}>push</button>
-     <button onClick={() => history.push("/user", { id: 13 })}>push state</button>
+     <button onClick={() => navigate("/user", {
+        state: { id: 13 }
+     })}>push state</button>
    </>
  );
}
```

### Attention!!!. It don't resolve the second reference,it will add some comments `fixme` for helping user to fix 

## License

MIT
