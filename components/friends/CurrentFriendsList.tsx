import React from "react";

import CurrentFriendsListItem from "./CurrentFriendsListItem";
import { user, NoMatches, StyledList } from "./utils";

interface CurrentFriendsListProps {
  friends: Array<user>;
  searchTerm: string;
}

const CurrentFriendsList = ({
  friends,
  searchTerm
}: CurrentFriendsListProps) => {
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
        <CurrentFriendsListItem key={friend.username} friend={friend} />
      ))}
    </StyledList>
  );
};

export default CurrentFriendsList;
