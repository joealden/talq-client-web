import React from "react";

import { removeMember, NoMatches, StyledList } from "./utils";
import MembersListItem from "./MembersListItem";

interface MembersListProps {
  members: Array<{ username: string }>;
  searchTerm: string;
  removeMember: removeMember;
}

const MembersList: React.SFC<MembersListProps> = ({
  members,
  searchTerm,
  removeMember
}) => {
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
