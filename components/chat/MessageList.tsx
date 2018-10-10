import React from "react";
import styled, { css } from "styled-components";
import * as R from "ramda";

import constants from "../../utils/constants";
import { UserDetailsContext } from "../layout";

/* TODO: Refactor both JSX and CSS to reduce repetition */

interface singleReducedMessage {
  id: string;
  content: string;
}

interface reducedMessage {
  id: string;
  author: {
    username: string;
  };
  messages: singleReducedMessage[];
}

interface message {
  id: string;
  author: {
    username: string;
  };
  content: string;
}

const messageReducer = (acc: any[], currentMessage: message) => {
  /* If accumulator is currently empty */

  if (acc.length === 0) {
    return [
      {
        /* Uses last id in consecutive messages, does this need changing? */
        id: currentMessage.id,
        author: currentMessage.author,
        messages: [
          {
            id: currentMessage.id,
            content: currentMessage.content
          }
        ]
      }
    ];
  }

  /**
   * NOTE:
   *
   * Dirty hack to get around Apollo cache rollback issue.
   * For some reason, I think it has something to do with the @connection
   * directives, on slow internet connections, the cache does not
   * rollback properly, which in turn results in the sent message being
   * displayed twice.
   *
   * The following implementation does not work:
   *
   * `if (R.last(acc).id === currentMessage.id) return acc;`
   *
   * This is because there could potentially be a race condition where if
   * another member of the chat sends a message near the same time as the
   * user sends a message, the other members message could be added to
   * list before the user gets a response from the server about their own
   * message. If this happened, the message would still be duplicated.
   * This is because using the above implementation, only sequential
   * messages in the list are checked to have the same id. In the
   * explained case, it means that the messages are not seqential.
   *
   * To get around this issue, we instead check the whole message list to
   * see if any messages have the same id as the message we are about to
   * add.
   *
   * This works fine, but it may incur a signifcant performance penalty
   * as everytime a new message is recieved, the whole message list needs
   * to be iterated over using the `some` array method.
   *
   * If this does become a performance issue, the best solution would be
   * to figure out why the cache rollback issue is happening and fix it.
   * This would mean that this check would not need to be made. Note that
   * I have already tried quite hard to locate the cause of the issue
   * with no success.
   */

  if (acc.some(message => message.id === currentMessage.id)) return acc;

  /* If the current message has the same author as the previous */
  const previousMessageUsername = R.last(acc).author.username;
  const currentMessageUsername = currentMessage.author.username;

  if (previousMessageUsername === currentMessageUsername) {
    return [
      ...R.dropLast(1, acc),
      {
        id: currentMessage.id,
        author: currentMessage.author,
        messages: [
          ...R.last(acc).messages,
          {
            id: currentMessage.id,
            content: currentMessage.content
          }
        ]
      }
    ];
  }

  /* If the current message has a different author than the previous */
  return [
    ...acc,
    {
      id: currentMessage.id,
      author: currentMessage.author,
      messages: [
        {
          id: currentMessage.id,
          content: currentMessage.content
        }
      ]
    }
  ];
};

interface MessageListProps {
  messages: message[];
  updateParentRefState: Function;
}

class MessageList extends React.Component<MessageListProps> {
  /* TODO: Figure out typing of styled component as any */
  messageListRef: React.RefObject<HTMLUListElement> = React.createRef();

  /* Pass ul ref up so parent can control scrolling */
  componentDidMount() {
    this.props.updateParentRefState(this.messageListRef);
  }

  render() {
    const { messages } = this.props;

    if (messages.length === 0)
      return (
        <MessageListWrapper>
          <CenterDiv>
            <p>No messages have been sent in this chat yet.</p>
          </CenterDiv>
        </MessageListWrapper>
      );

    return (
      <UserDetailsContext.Consumer>
        {({ username }) => {
          const reducedMessages = messages.reduce(messageReducer, []);

          return (
            <MessageListWrapper innerRef={this.messageListRef}>
              {reducedMessages.map((message: reducedMessage) => {
                if (message.author.username === username) {
                  if (message.messages.length === 1) {
                    return (
                      <MySingleMessage key={message.id}>
                        <p>{message.messages[0].content}</p>
                      </MySingleMessage>
                    );
                  }

                  return (
                    <MyMultipleMessage key={message.id}>
                      <div>
                        {message.messages.map(singleMessage => (
                          <span key={singleMessage.id}>
                            <p>{singleMessage.content}</p>
                          </span>
                        ))}
                      </div>
                    </MyMultipleMessage>
                  );
                } else {
                  if (message.messages.length === 1) {
                    return (
                      <MembersSingleMessage key={message.id}>
                        <span>{message.author.username}</span>
                        <div>
                          <p>{message.messages[0].content}</p>
                        </div>
                      </MembersSingleMessage>
                    );
                  }

                  return (
                    <MembersMultipleMessage key={message.id}>
                      <span>{message.author.username}</span>
                      <div>
                        {message.messages.map(singleMessage => (
                          <span key={singleMessage.id}>
                            <p>{singleMessage.content}</p>
                          </span>
                        ))}
                      </div>
                    </MembersMultipleMessage>
                  );
                }
              })}
            </MessageListWrapper>
          );
        }}
      </UserDetailsContext.Consumer>
    );
  }
}

export default MessageList;

const MessageListWrapper = styled.ul`
  flex: 1;
  list-style: none;
  padding: 10px;
  overflow: auto;
`;

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  p {
    text-align: center;
    margin: 15px;
  }
`;

const messageStyles = css`
  display: flex;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 10px;
  }

  p {
    padding: 6px 10px;
    overflow-wrap: break-word;
  }
`;

const MySingleMessage = styled.li`
  ${messageStyles};

  justify-content: flex-end;

  p {
    background-color: ${constants.color};
    color: white;
    border-radius: 15px;
    max-width: 60%;
  }
`;

const MyMultipleMessage = styled.li`
  ${messageStyles};

  justify-content: flex-end;

  div {
    max-width: 60%;
    display: flex;
    flex-direction: column;

    span {
      display: flex;
      justify-content: flex-end;

      p {
        background-color: ${constants.color};
        color: white;
        border-radius: 15px 4px 4px 15px;
        display: inline-block;
        max-width: 100%;
      }
    }

    span:first-child p {
      border-top-right-radius: 15px;
      border-top-left-radius: 15px;
    }

    span:last-child p {
      border-bottom-right-radius: 15px;
    }

    span:not(:last-child) {
      margin-bottom: 2px;
    }
  }
`;

const MembersSingleMessage = styled.li`
  ${messageStyles};
  flex-direction: column;

  span {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    padding-left: 12px;
    margin-bottom: 1px;
  }

  div {
    display: flex;

    p {
      background-color: #f1f0f0;
      color: black;
      border-radius: 15px;
      max-width: 60%;
    }
  }
`;

const MembersMultipleMessage = styled.li`
  ${messageStyles};

  flex-direction: column;

  & > span {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    padding-left: 12px;
    margin-bottom: 1px;
  }

  div {
    display: flex;
    flex-direction: column;
    max-width: 60%;

    span {
      display: flex;

      p {
        background-color: #f1f0f0;
        color: black;
        border-radius: 4px 15px 15px 4px;
        display: inline-block;
        max-width: 100%;
      }
    }

    span:first-child p {
      border-top-left-radius: 15px;
    }

    span:last-child p {
      border-bottom-left-radius: 15px;
    }

    span:not(:last-child) {
      margin-bottom: 2px;
    }
  }
`;
