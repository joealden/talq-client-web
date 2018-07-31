import React from "react";
import styled, { css } from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { message } from "./ChatUI";

import constants from "../../utils/constants";
import ShowApolloError from "../ApolloError";

/*
 * TODO: Figure out how to correct styles consecutive message
 * like messenger does with the following traits:
 * 
 * - Less spacing
 * - Name is not repeated
 * - Message bubble corners come together.
 * 
 * Possible solution
 * -----------------
 * Use a reduce function on the messages array before mapping
 * to list items (li).
 * 
 * Start with an empty array in the acc reducing the messages 
 * array. If the last item in the array has the same author as
 * the current message that is being acted upon, modify that last
 * item in the array by appending an extra paragraph (p) tag with
 * the contents of the current message. 
 * 
 * This item will now need to be wrapped with a different styled
 * component to handle the message bubble corner styling. This would
 * mean that a regular wrapper around a single message would have 
 * regular border radius. Then a different wrapper would be used to
 * contain multiple consecutive messages that would use the following
 * styling:
 * 
 * 
 * p:first-child {
 *   border-bottom-left-radius: 4px;
 *   border-top-left:radius: 15px;
 * }
 * p {
 *   border-radius: 4px 15px 15px 4px;
 * }
 * p:last-child {
 *   border-bottom-left:radius: 15px;
 *   border-top-left-radius: 4px;
 * }
 */

const USERNAME_QUERY = gql`
  query USERNAME_QUERY {
    user {
      username
    }
  }
`;

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
          <CenterDiv>No messages have been sent in this chat yet.</CenterDiv>
        </MessageListWrapper>
      );

    return (
      <Query query={USERNAME_QUERY}>
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <MessageListWrapper>
                <CenterDiv>Loading messages...</CenterDiv>
              </MessageListWrapper>
            );
          }

          return (
            <React.Fragment>
              <ShowApolloError error={error} />
              <MessageListWrapper innerRef={this.messageListRef}>
                {messages.map(message => {
                  if (message.author.username === data.user.username) {
                    return (
                      <MyMessage key={message.id}>
                        <p>{message.content}</p>
                      </MyMessage>
                    );
                  }

                  return (
                    <MembersMessage key={message.id}>
                      <span>{message.author.username}</span>
                      <div>
                        <p>{message.content}</p>
                      </div>
                    </MembersMessage>
                  );
                })}
              </MessageListWrapper>
            </React.Fragment>
          );
        }}
      </Query>
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
`;

const messageStyles = css`
  display: flex;
  margin-bottom: 6px;

  p {
    border-radius: 15px;
    padding: 6px 10px;
    max-width: 60%;
  }
`;

const MyMessage = styled.li`
  ${messageStyles};

  justify-content: flex-end;

  p {
    background-color: ${constants.color};
    color: white;
  }
`;

const MembersMessage = styled.li`
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
    }
  }
`;
