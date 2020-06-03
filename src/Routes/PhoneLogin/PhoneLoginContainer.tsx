import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import {
  startPhoneVerification,
  startPhoneVerificationVariables,
} from "../../types/api";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { PHONE_SIGN_IN } from "./PhoneLogin.queries";

interface IState {
  countryCode: string;
  phoneNumber: string;
}

class PhoneSignInMutation extends Mutation<
  startPhoneVerification,
  startPhoneVerificationVariables
> {}

class PhoneLoginContainer extends React.Component<
  RouteComponentProps<any>,
  IState
> {
  public phoneMutation: MutationFn<any, any> | undefined = undefined;
  public state = {
    countryCode: "+82",
    phoneNumber: "",
  };

  public render() {
    const { history } = this.props;
    const { countryCode, phoneNumber } = this.state;
    return (
      <PhoneSignInMutation
        mutation={PHONE_SIGN_IN}
        variables={{
          phoneNumber: `${countryCode}${phoneNumber}`,
        }}
        onCompleted={(data) => {
          const { StartPhoneVerification } = data;
          const phone = `${countryCode}${phoneNumber}`;
          if (StartPhoneVerification) {
            console.log(StartPhoneVerification);
            if (StartPhoneVerification.ok) {
              toast.success("SMS Sent! Redirecting you...");
              setTimeout(() => {
                history.push({
                  pathname: "/verify-phone",
                  state: {
                    phone,
                  },
                });
              }, 2000);
              return;
            } else {
              toast.error(StartPhoneVerification.error);
            }
          } else {
            toast.error("mutation is not found");
          }
        }}
      >
        {(phoneMutation, { loading }) => {
          this.phoneMutation = phoneMutation;
          return (
            <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
              loading={loading}
            />
          );
        }}
      </PhoneSignInMutation>
    );
  }

  public onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const { countryCode, phoneNumber } = this.state;
    const phone = `${countryCode}${phoneNumber}`;
    const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(phone);
    if (isValid) {
      if (this.phoneMutation) {
        this.phoneMutation();
      }
    } else {
      toast.error("Please write a valid phone number");
    }
  };

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (event) => {
    const {
      target: { name, value },
    } = event;
    this.setState({
      [name]: value,
    } as any);
  };
}

export default PhoneLoginContainer;
