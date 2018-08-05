import React from "react";
import styled from "styled-components";

import AllUsersListItem from "./AllUsersListItem";
import constants from "../../utils/constants";

/* TODO: Dedup code between both friends page lists */

type user = {
  username: string;
};

interface AllUsersListProps {
  users: Array<user>;
  friends: Array<user>;
  searchTerm: string;
}

const AllUsersList = ({ users, friends, searchTerm }: AllUsersListProps) => {
  const filteredUsers = users.filter(user =>
    user.username.includes(searchTerm)
  );

  if (filteredUsers.length === 0) {
    return (
      <NoMatches>
        No users have a username that match this search term.
      </NoMatches>
    );
  }

  return (
    <AllUsersListWrapper>
      {filteredUsers.map(user => (
        <AllUsersListItem key={user.username} user={user} friends={friends} />
      ))}
    </AllUsersListWrapper>
  );
};

export default AllUsersList;

const AllUsersListWrapper = styled.ul`
  li {
    padding: 5px 10px;

    &:hover {
      background-color: #f5f6f7;
    }

    display: flex;
    justify-content: space-between;

    div {
      font-size: 15px;
      display: flex;
      align-items: center;
    }

    button {
      cursor: pointer;
      border: none;
      border-radius: 4px;
      background-color: ${constants.color};
      padding: 5px 8px;
      color: white;
      font-weight: normal;
      font-size: 15px;

      &:disabled {
        background-color: grey;
        cursor: not-allowed;
      }
    }
  }
`;

const NoMatches = styled.div`
  text-align: center;
  font-size: 15px;
  margin-top: 12px;
`;
