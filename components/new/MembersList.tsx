import React from "react";

import { NoMatches, StyledList } from "./utils";
import MembersListItem from "./MembersListItem";

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
