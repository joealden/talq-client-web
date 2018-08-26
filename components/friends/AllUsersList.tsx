import React from "react";

import AllUsersListItem from "./AllUsersListItem";
import { user, NoMatches, StyledList } from "./utils";

interface AllUsersListProps {
  users: Array<user>;
  friends: Array<user>;
  searchTerm: string;
}

const AllUsersList: React.SFC<AllUsersListProps> = ({
  users,
  friends,
  searchTerm
}) => {
  const normalisedSearchTerm = searchTerm.toLowerCase();

  const filteredUsers = users.filter(user => {
    const normalisedUsername = user.username.toLowerCase();
    return normalisedUsername.includes(normalisedSearchTerm);
  });

  if (filteredUsers.length === 0) {
    return (
      <NoMatches>
        No users have a username that match this search term.
      </NoMatches>
    );
  }

  return (
    <StyledList>
      {filteredUsers.map(user => (
        <AllUsersListItem key={user.username} user={user} friends={friends} />
      ))}
    </StyledList>
  );
};

export default AllUsersList;
