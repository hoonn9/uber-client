import React from "react";
import { Mutation } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyPhone, verifyPhoneVariables } from "../../types/api";
import VerifyPhonePresenter from "./VerifyPhonePresenter";
import { VERIFY_PHONE } from "./VerifyPhone.queries";
import { LOG_USER_IN } from "../../sharedQueries.local";

interface IState {
  verificationKey: string;
  phoneNumber: string;
}

interface IProps extends RouteComponentProps<any> {}

class VerifyMutation extends Mutation<verifyPhone, verifyPhoneVariables> {}

class VerifyPhoneContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    try {
      Object.hasOwnProperty.call(props.location.state, "phone");
    } catch (e) {
      props.history.push("/");
    }
    if (!props.location.state) {
      props.history.push("/");
    } else {
      this.state = {
        phoneNumber: props.location.state["phone"],
        verificationKey: "",
      };
    }
  }
  public render() {
    const { verificationKey, phoneNumber } = this.state;
    return (
      <Mutation mutation={LOG_USER_IN}>
        {(logUserIn) => (
          <VerifyMutation
            mutation={VERIFY_PHONE}
            variables={{
              key: verificationKey,
              phoneNumber,
            }}
            onCompleted={(data) => {
              const { CompletePhoneVerification } = data;
              console.log(CompletePhoneVerification);
              if (CompletePhoneVerification.ok) {
                logUserIn({
                  variables: {
                    token: CompletePhoneVerification.token,
                  },
                });
                toast.success("You're verified, loggin in now");
              } else {
                toast.error(CompletePhoneVerification.error);
              }
            }}
          >
            {(mutation, { loading }) => (
              <VerifyPhonePresenter
                onSubmit={mutation}
                onChange={this.onInputChange}
                verificationKey={verificationKey}
                loading={loading}
              />
            )}
          </VerifyMutation>
        )}
      </Mutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const {
      target: { name, value },
    } = event;
    this.setState({
      [name]: value,
    } as any);
  };
}

export default VerifyPhoneContainer;
