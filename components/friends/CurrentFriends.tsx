import React from "react";
import styled from "styled-components";

import SearchBox from "../SearchBox";

class CurrentFriends extends React.Component {
  render() {
    return (
      <div>
        <SearchBox
          type="search"
          title="Search current friends"
          placeholder="Search for current friends..."
          spellCheck={false}
          autoComplete="off"
        />
        <ListWrapper>
          <ul>
            <li>Test Item</li>
            <li>Test Item</li>
            <li>Test Item</li>
          </ul>
        </ListWrapper>
      </div>
    );
  }
}

export default CurrentFriends;

const ListWrapper = styled.div`
  margin-top: 10px;

  ul {
    list-style: none;

    li {
      padding: 5px 0;
    }
  }
`;
