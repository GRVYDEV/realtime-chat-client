import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createClient, Provider } from "urql";
import SocketProvider from "./providers/SocketProvider";
const client = createClient({
  url: "http://localhost:4000/api/",
});

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <SocketProvider wsUrl="ws://localhost:4000/socket">
        <App />
      </SocketProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
