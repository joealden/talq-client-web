import React from "react";

import { removeMember, addMember, RemoveButton, AddButton } from "./utils";

interface FriendsListItemProps {
  friend: {
    username: string;
  };
  members: Array<{ username: string }>;
  removeMember: removeMember;
  addMember: addMember;
}

const FriendsListItem: React.SFC<FriendsListItemProps> = ({
  friend,
  members,
  removeMember,
  addMember
}) => {
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
