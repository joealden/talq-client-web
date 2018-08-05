import React from "react";
import styled from "styled-components";

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

const RemoveButton = styled.button`
  &:hover {
    background-color: #ea3232;
  }
`;
