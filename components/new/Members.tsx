import React from "react";

import { user, removeMember, CenterDiv, ListWrapper } from "./utils";
import SearchBox from "../SearchBox";
import MembersList from "./MembersList";

interface MembersProps {
  members: Array<user>;
  removeMember: removeMember;
}

interface MembersState {
  searchTerm: string;
}

class Members extends React.Component<MembersProps, MembersState> {
  state = {
    searchTerm: ""
  };

  updateSearchTermState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value.trim() });
  };

  componentDidUpdate() {
    /* Reset the search input if friends list becomes empty */
    if (this.props.members.length === 0 && this.state.searchTerm !== "") {
      this.setState({ searchTerm: "" });
    }
  }

  render() {
    const { members, removeMember } = this.props;

    if (members.length === 0) {
      return (
        <CenterDiv>
          <p>No members have been added to this chat yet.</p>
        </CenterDiv>
      );
    }

    return (
      <div>
        <SearchBox
          boxMargin={10}
          type="search"
          title="Search current members"
          placeholder="Search for current chat members..."
          spellCheck={false}
          autoComplete="off"
          onChange={this.updateSearchTermState}
          value={this.state.searchTerm}
        />
        <ListWrapper>
          <MembersList
            members={members}
            searchTerm={this.state.searchTerm}
            removeMember={removeMember}
          />
        </ListWrapper>
      </div>
    );
  }
}

export default Members;
