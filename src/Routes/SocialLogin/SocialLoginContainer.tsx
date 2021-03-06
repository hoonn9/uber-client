import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { facebookConnect, facebookConnectVariables } from "../../types/api";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { FACEBOOK_CONNECT } from "./SocialLogin.queries";
import { LOG_USER_IN } from "../../sharedQueries.local";
class LoginMutation extends Mutation<
  facebookConnect,
  facebookConnectVariables
> {}

interface IState {
  firstName: string;
  lastName: string;
  email?: string;
  fbId: string;
}

interface IProps extends RouteComponentProps<any> {}

class SocialLoginContainer extends React.Component<IProps, IState> {
  public state = {
    email: "",
    fbId: "",
    firstName: "",
    lastName: "",
  };
  public facebookMutation: MutationFn<any, any> | undefined = undefined;
  public render() {
    return (
      <Mutation mutation={LOG_USER_IN}>
        {(logUserIn) => (
          <LoginMutation
            mutation={FACEBOOK_CONNECT}
            onCompleted={(data) => {
              const { FacebookConnect } = data;
              if (FacebookConnect.ok) {
                logUserIn({
                  variables: {
                    token: FacebookConnect.token,
                  },
                });
              } else {
                toast.error(FacebookConnect.error);
              }
            }}
          >
            {(facebookMutation, { loading }) => {
              this.facebookMutation = facebookMutation;
              return (
                <SocialLoginPresenter loginCallback={this.loginCallback} />
              );
            }}
          </LoginMutation>
        )}
      </Mutation>
    );
  }

  public loginCallback = (response) => {
    console.log(response);
    const { name, email, id, accessToken } = response;
    if (accessToken) {
      toast.success(`Welcome ${name}!`);
      if (accessToken && this.facebookMutation) {
        this.facebookMutation({
          variables: {
            email,
            fbId: id,
            firstName: name.split(" ")[0],
            lastName: name.split(" ")[1],
          },
        });
      }
    } else {
      toast.error("Could not log you in 😔");
    }
  };
}

export default SocialLoginContainer;
