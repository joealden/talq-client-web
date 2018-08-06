import React from "react";

import { NoMatches, StyledList } from "./utils";
import FriendsListItem from "./FriendsListItem";

interface user {
  username: string;
}

interface MembersListProps {
  friends: Array<user>;
  members: Array<user>;
  searchTerm: string;
  removeMember: (usernameOfUserToRemove: string) => void;
  addMember: (usernameOfUserToAdd: string) => void;
}

const FriendsList = ({
  friends,
  members,
  searchTerm,
  removeMember,
  addMember
}: MembersListProps) => {
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
