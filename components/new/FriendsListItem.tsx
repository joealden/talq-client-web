import React from "react";
import styled from "styled-components";

interface user {
  username: string;
}

interface FriendsListItemProps {
  friend: user;
  members: Array<user>;
  removeMember: (usernameOfUserToRemove: string) => void;
  addMember: (usernameOfUserToAdd: string) => void;
}

const FriendsListItem = ({
  friend,
  members,
  removeMember,
  addMember
}: FriendsListItemProps) => {
  const friendIsAlreadyAMember = members.some(
    member => member.username === friend.username
  );

  if (friendIsAlreadyAMember) {
    return (
      <li>
        <div>{friend.username}</div>
        <RemoveButton onClick={() => removeMember(friend.username)}>
          Remove
        </RemoveButton>
      </li>
    );
  }

  return (
    <li>
      <div>{friend.username}</div>
      <AddButton onClick={() => addMember(friend.username)}>Add</AddButton>
    </li>
  );
};

export default FriendsListItem;

const AddButton = styled.button`
  &:hover {
    background-color: #66cd00;
  }
`;

const RemoveButton = styled.button`
  &:hover {
    background-color: #ea3232;
  }
`;
