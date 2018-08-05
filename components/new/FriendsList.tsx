import React from "react";
import styled from "styled-components";

import constants from "../../utils/constants";
import FriendsListItem from "./FriendsListItem";

interface user {
  username: string;
}

interface MembersListProps {
  friends: Array<user>;
  members: Array<user>;
  searchTerm: string;
  removeMember: (usernameOfUserToRemove: string) => void;
  addMember: (usernameOfUserToAdd: string) => void;
}

const FriendsList = ({
  friends,
  members,
  searchTerm,
  removeMember,
  addMember
}: MembersListProps) => {
  const filteredFriends = friends.filter(friend =>
    friend.username.includes(searchTerm)
  );

  if (filteredFriends.length === 0) {
    return (
      <NoMatches>
        None of your friend's usernames match this search term.
      </NoMatches>
    );
  }

  return (
    <StyledList>
      {filteredFriends.map(friend => (
        <FriendsListItem
          key={friend.username}
          friend={friend}
          members={members}
          removeMember={removeMember}
          addMember={addMember}
        />
      ))}
    </StyledList>
  );
};

export default FriendsList;

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
