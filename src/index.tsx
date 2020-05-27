import React from "react";
import { ApolloProvider } from "react-apollo";
import apolloClient from "./apollo";
import ReactDOM from "react-dom";
import App from "Components/App";

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById("root") as HTMLElement
);
