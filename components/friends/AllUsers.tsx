import React from "react";
import styled from "styled-components";

import SearchBox from "../SearchBox";

class AllUsers extends React.Component {
  render() {
    return (
      <div>
        <SearchBox
          type="search"
          title="Search for new friends"
          placeholder="Search for new friends..."
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

export default AllUsers;

const ListWrapper = styled.div`
  margin-top: 10px;

  ul {
    list-style: none;

    li {
      padding: 5px 0;
    }
  }
`;
