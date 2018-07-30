import React from "react";
import styled from "styled-components";
// import { Mutation } from "react-apollo";
// import gql from "graphql-tag";

import constants from "../../utils/constants";

/* TODO: Make message state clear when navigating between chats */

interface CreateMessageBoxState {
  message: string;
}

class CreateMessageBox extends React.Component<{}, CreateMessageBoxState> {
  state = {
    message: ""
  };

  updateMessageState = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ message: event.target.value });
  };

  render() {
    return (
      <CreateMessageBoxWrapper>
        <textarea
          placeholder="Type a message..."
          value={this.state.message}
          onChange={this.updateMessageState}
          onKeyDown={event => {
            /* If key pressed is the enter key */
            if (event.keyCode === 13) {
              /* TODO: call send mutation */
              console.log("enter has been pressed");
            }
          }}
        />
        <button onClick={/* TODO */ () => null}>Send</button>
      </CreateMessageBoxWrapper>
    );
  }
}

export default CreateMessageBox;

/* 
 * TODO:
 * - Make it so that like messenger, the box
 *   grows to a certain point(max-height) when
 *   the amount of text increases (also using
 *   min-height).
 * - Like messenger, remove padding at top of
 *   box when scrolling
 */

const createMessageBoxHeight = 60;

const CreateMessageBoxWrapper = styled.div`
  height: ${createMessageBoxHeight}px;

  border-top: ${constants.borderHorizontal};
  display: flex;

  textarea {
    height: 100%;
    flex: 1;
    padding: 14px;
    padding-bottom: 0;
    resize: none;
    outline: none;
    border: none;
    border-right: ${constants.borderHorizontal};
  }

  button {
    width: 100px;
    background-color: white;
    color: ${constants.color};
    font-weight: normal;
    border: none;
    transition: 0.1s ease-in-out;
    cursor: pointer;

    &:hover,
    &:focus {
      background-color: rgba(0, 0, 0, 0.1);
    }

    &:active {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
`;
