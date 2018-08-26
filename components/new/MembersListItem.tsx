import React from "react";

import { removeMember, RemoveButton } from "./utils";

interface MembersListItemProps {
  member: {
    username: string;
  };
  removeMember: removeMember;
}

const MembersListItem: React.SFC<MembersListItemProps> = ({
  member,
  removeMember
}) => (
  <li>
    <div>{member.username}</div>
    <RemoveButton onClick={() => removeMember(member.username)}>
      Remove
    </RemoveButton>
  </li>
);

export default MembersListItem;
