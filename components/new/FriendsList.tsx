import React from "react";

import { removeMember, addMember, NoMatches, StyledList } from "./utils";
import FriendsListItem from "./FriendsListItem";

interface MembersListProps {
  friends: Array<{ username: string }>;
  members: Array<{ username: string }>;
  searchTerm: string;
  removeMember: removeMember;
  addMember: addMember;
}

const FriendsList: React.SFC<MembersListProps> = ({
  friends,
  members,
  searchTerm,
  removeMember,
  addMember
}) => {
  const normalisedSearchTerm = searchTerm.toLowerCase();

  const filteredFriends = friends.filter(friend => {
    const normalisedUsername = friend.username.toLowerCase();
    return normalisedUsername.includes(normalisedSearchTerm);
  });

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
