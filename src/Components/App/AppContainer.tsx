import React from "react";
import { graphql } from "react-apollo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import theme from "../../theme";
import { ThemeProvider } from "../../typed-components";
import { IS_LOGGED_IN } from "./AppQueries.local";
import AppPresenter from "./AppPresenter";
import dotenv from "dotenv";
dotenv.config();

const AppContainer = ({ data }: any) => (
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </ThemeProvider>
    <ToastContainer draggable={true} position={"bottom-center"} />
  </React.Fragment>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
