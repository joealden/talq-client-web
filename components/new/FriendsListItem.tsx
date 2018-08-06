import React from "react";

import {
  user,
  removeMember,
  addMember,
  RemoveButton,
  AddButton
} from "./utils";

interface FriendsListItemProps {
  friend: user;
  members: Array<user>;
  removeMember: removeMember;
  addMember: addMember;
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
