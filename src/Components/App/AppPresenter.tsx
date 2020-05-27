import PropTypes from "prop-types";
import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AddPlaces from "Routes/AddPlace";
import EditAccount from "Routes/EditAccount";
import FindAddress from "Routes/FindAddress";
import Home from "Routes/Home";
import Login from "../../Routes/Login";
import PhoneLogin from "Routes/PhoneLogin";
import Places from "Routes/Places";
import Ride from "Routes/Ride";
import Settings from "Routes/Settings";
import SocialLogin from "Routes/SocialLogin";
import VerifyPhone from "Routes/VerifyPhone";

interface IProps {
  isLoggedIn: boolean;
}

const LoggedOutRoutes: React.SFC = () => (
  <Switch>
    <Route path={"/"} exact={true} component={Login} />
    <Route path={"/phone-login"} exact={true} component={PhoneLogin} />
    <Route path={"/verify-phone"} exact={true} component={VerifyPhone} />
    <Route path={"/social-login"} exact={true} component={SocialLogin} />
    <Redirect from={"*"} to={"/"} />
  </Switch>
);

const LoggedInRouter: React.SFC = () => (
  <Switch>
    <Route path={"/"} exact={true} component={Home} />
    <Route path={"/ride"} exact={true} component={Ride} />
    <Route path={"/edit-account"} exact={true} component={EditAccount} />
    <Route path={"/settings"} exact={true} component={Settings} />
    <Route path={"/places"} exact={true} component={Places} />
    <Route path={"/add-place"} exact={true} component={AddPlaces} />
    <Route path={"/find-address"} exact={true} component={FindAddress} />
    <Redirect from={"*"} to={"/"} />
  </Switch>
);

const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) => (
  <BrowserRouter>
    {isLoggedIn ? <LoggedInRouter /> : <LoggedOutRoutes />}
  </BrowserRouter>
);

AppPresenter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default AppPresenter;
