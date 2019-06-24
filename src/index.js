import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { BrowserRouter } from "react-router-dom";
import thunk from 'redux-thunk';
import App from "./App";
import reducers from "./reducers"
import "./assets/semantic/dist/semantic.min.css";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
