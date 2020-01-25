import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { createBrowserHistory } from "history";
// import { store } from "./store";
import { Router, Route } from "react-router-dom";

// Reducers
const history = createBrowserHistory();

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Router history={history}>
    <Route exact path="/" component={App}>
      {/* <Route path = "/second" component = {SecondPage}/> */}
    </Route>
    {/* <Route path="/home" component={Home} /> */}
  </Router>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
