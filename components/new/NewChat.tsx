import React from "react";
import styled from "styled-components";

import Layout from "../layout";
import constants from "../../utils/constants";

import Members from "./Members";
import Friends from "./Friends";
import InitalMessageAndTitle from "./InitialMessageAndTitle";

interface user {
  username: string;
}

interface NewChatState {
  members: Array<user>;
}

class NewChat extends React.Component<{}, NewChatState> {
  state = {
    members: []
  };

  removeMember = (usernameOfUserToRemove: string) => {
    this.setState(prevState => {
      const updatedMembers = prevState.members.filter(
        member => member.username !== usernameOfUserToRemove
      );

      return {
        members: updatedMembers
      };
    });
  };

  addMember = (usernameOfUserToAdd: string) => {
    this.setState(prevState => ({
      members: [
        ...prevState.members,
        {
          username: usernameOfUserToAdd
        }
      ]
    }));
  };

  render() {
    return (
      <Layout mainTitle="New Chat">
        <ChatWrapper>
          <div>
            <ChatColumn>
              <div>
                <h3>Members</h3>
              </div>
              <Members
                members={this.state.members}
                removeMember={this.removeMember}
              />
            </ChatColumn>
            <ChatColumn>
              <div>
                <h3>Friends</h3>
              </div>
              <Friends
                members={this.state.members}
                removeMember={this.removeMember}
                addMember={this.addMember}
              />
            </ChatColumn>
          </div>
          <div>
            <InitalMessageAndTitle members={this.state.members} />
          </div>
        </ChatWrapper>
      </Layout>
    );
  }
}

export default NewChat;

const InitialMessageBoxHeight = 60;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-child {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;

    & > div:first-child {
      border-right: ${constants.borderHorizontal};
    }
  }

  & > div:last-child {
    height: ${InitialMessageBoxHeight}px;
  }
`;

const titleSectionHeight = 40;

const ChatColumn = styled.div`
  display: flex;
  flex-direction: column;

  & > :first-child {
    border-bottom: ${constants.borderHorizontal};
    height: ${titleSectionHeight}px;
    display: flex;
    justify-content: center;
    align-items: center;

    h3 {
      font-size: 16px;
      text-align: center;
    }
  }

  & > :last-child {
    height: calc(
      100vh -
        ${constants.headerHeight +
          titleSectionHeight +
          InitialMessageBoxHeight}px
    );
    overflow: auto;
  }
`;
