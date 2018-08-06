import React from "react";

import { RemoveButton } from "./utils";

interface user {
  username: string;
}

interface MembersListItemProps {
  member: user;
  removeMember: (usernameOfUserToRemove: string) => void;
}

const MembersListItem = ({ member, removeMember }: MembersListItemProps) => (
  <li>
    <div>{member.username}</div>
    <RemoveButton onClick={() => removeMember(member.username)}>
      Remove
    </RemoveButton>
  </li>
);

export default MembersListItem;
