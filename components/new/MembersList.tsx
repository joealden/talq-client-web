import React from "react";
import styled from "styled-components";

import MembersListItem from "./MembersListItem";
import constants from "../../utils/constants";

interface user {
  username: string;
}

interface MembersListProps {
  members: Array<user>;
  searchTerm: string;
  removeMember: (usernameOfUserToRemove: string) => void;
}

const MembersList = ({
  members,
  searchTerm,
  removeMember
}: MembersListProps) => {
  const normalisedSearchTerm = searchTerm.toLowerCase();

  const filteredMembers = members.filter(member => {
    const normalisedUsername = member.username.toLowerCase();
    return normalisedUsername.includes(normalisedSearchTerm);
  });

  if (filteredMembers.length === 0) {
    return (
      <NoMatches>
        None of the chat's current member's have a username that matches this
        search term.
      </NoMatches>
    );
  }

  return (
    <StyledList>
      {filteredMembers.map(member => (
        <MembersListItem
          key={member.username}
          member={member}
          removeMember={removeMember}
        />
      ))}
    </StyledList>
  );
};

export default MembersList;

export const StyledList = styled.ul`
  li {
    padding: 5px 10px;

    &:hover {
      background-color: #f5f6f7;
    }

    display: flex;
    justify-content: space-between;

    div {
      display: flex;
      align-items: center;
      font-size: 15px;
    }

    button {
      background-color: ${constants.color};
      border: none;
      border-radius: 4px;
      padding: 5px 8px;
      font-weight: normal;
      font-size: 15px;
      color: white;
      cursor: pointer;

      /* So that both add and remove buttons are same width */
      min-width: 70px;

      &:disabled {
        background-color: grey;
        cursor: not-allowed;
      }
    }
  }
`;

export const NoMatches = styled.div`
  text-align: center;
  font-size: 15px;
  margin: 12px 15px 0px 15px;
`;
