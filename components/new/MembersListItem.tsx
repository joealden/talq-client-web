import React from "react";

import { user, removeMember, RemoveButton } from "./utils";

interface MembersListItemProps {
  member: user;
  removeMember: removeMember;
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
