import styled from "styled-components";
import constants from "../../utils/constants";

/**
 * TODO: Extract out common code
 * between new chat page and friends page
 */

/* ----------------------------- STYLES ----------------------------- */

export const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
    margin: 15px;
  }
`;

export const ListWrapper = styled.div`
  ul {
    list-style: none;
  }
`;

export const StyledList = styled.ul`
  li {
    padding: 5px 10px;

    &:hover {
      background-color: #f5f6f7;
    }

    display: flex;
    justify-content: space-between;

    div {
      display: flex;
      align-items: center;
      font-size: 15px;
    }

    button {
      background-color: ${constants.color};
      border: none;
      border-radius: 4px;
      padding: 5px 8px;
      font-weight: normal;
      font-size: 15px;
      color: white;
      cursor: pointer;

      /* So that both add and remove buttons are same width */
      min-width: 70px;

      &:disabled {
        background-color: grey;
        cursor: not-allowed;
      }
    }
  }
`;

export const NoMatches = styled.div`
  text-align: center;
  font-size: 15px;
  margin: 12px 15px 0px 15px;
`;

export const AddButton = styled.button`
  &:hover {
    background-color: #66cd00;
  }
`;

export const RemoveButton = styled.button`
  &:hover {
    background-color: #ea3232;
  }
`;

/* ------------------------------------------------------------------ */
