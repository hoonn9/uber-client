import React from "react";
import { SubscribeToMoreOptions } from "apollo-client";
import { Mutation, MutationFn, Query } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { USER_PROFILE } from "../../sharedQueries.queries";
import {
  getChat,
  getChatVariables,
  sendMessage,
  sendMessageVariables,
  userProfile,
} from "../../types/api";
import ChatPresenter from "./ChatPresenter";
import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES } from "./Chat.queries";

interface IProps extends RouteComponentProps<any> {}
interface IState {
  message: "";
  subscribedToNewLinks: boolean;
}

class ProfileQuery extends Query<userProfile> {}
class ChatQuery extends Query<getChat, getChatVariables> {}
class SendMessageMutation extends Mutation<sendMessage, sendMessageVariables> {}

class ChatContainer extends React.Component<IProps, IState> {
  public sendMessageFn:
    | MutationFn<sendMessage, sendMessageVariables>
    | undefined;

  constructor(props: IProps) {
    super(props);
    if (!props.match.params.chatId) {
      props.history.push("/");
    }
    this.state = {
      message: "",
      subscribedToNewLinks: false,
    };
  }
  public render() {
    const {
      match: {
        params: { chatId },
      },
    } = this.props;
    const { message, subscribedToNewLinks } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <ChatQuery
            query={GET_CHAT}
            variables={{ chatId: parseInt(chatId, 10) }}
          >
            {({ data, loading, subscribeToMore }) => {
              const subscribeToMoreOptions: SubscribeToMoreOptions = {
                document: SUBSCRIBE_TO_MESSAGES,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }
                  console.log(prev, subscriptionData);
                  const {
                    data: { MessageSubscription },
                  } = subscriptionData;
                  const {
                    GetChat: {
                      chat: { messages },
                    },
                  } = prev;
                  const newMessageId = MessageSubscription.id;
                  const latestMessageId = messages[messages.length - 1].id;

                  if (newMessageId === latestMessageId) {
                    return;
                  }

                  const newObject = Object.assign({}, prev, {
                    GetChat: {
                      ...prev.GetChat,
                      chat: {
                        ...prev.GetChat.chat,
                        messages: [
                          ...prev.GetChat.chat.messages,
                          MessageSubscription,
                        ],
                      },
                    },
                  });
                  return newObject;
                },
              };
              if (!subscribedToNewLinks) {
                subscribeToMore(subscribeToMoreOptions);
                this.setState({ subscribedToNewLinks: true });
              }
              return (
                <SendMessageMutation mutation={SEND_MESSAGE}>
                  {(sendMessageFn) => {
                    this.sendMessageFn = sendMessageFn;
                    return (
                      <ChatPresenter
                        data={data}
                        loading={loading}
                        userData={userData}
                        messageText={message}
                        onInputChange={this.onInputChange}
                        onSubmit={this.onSubmit}
                      />
                    );
                  }}
                </SendMessageMutation>
              );
            }}
          </ChatQuery>
        )}
      </ProfileQuery>
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
  public onSubmit = () => {
    const { message } = this.state;
    const {
      match: {
        params: { chatId },
      },
    } = this.props;
    if (message !== "") {
      this.setState({
        message: "",
      });
      if (this.sendMessageFn) {
        this.sendMessageFn({
          variables: {
            chatId: parseInt(chatId, 10),
            text: message,
          },
        });
      }
    }
    return;
  };
}

export default ChatContainer;
