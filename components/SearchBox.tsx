import styled from "styled-components";

interface SearchBoxProps {
  boxMargin?: number /* Defaults to 0 */;
  boxHeight?: number /* Defaults to 36(px) */;
}

const SearchBox = styled("input")<SearchBoxProps>`
  margin: ${({ boxMargin }) => (boxMargin ? boxMargin : 0)}px;
  width: calc(100% - ${({ boxMargin }) => (boxMargin ? boxMargin * 2 : 0)}px);
  height: ${({ boxHeight }) => (boxHeight ? boxHeight : 36)}px;
  padding: 10px 10px 10px ${({ boxHeight }) => (boxHeight ? boxHeight : 36)}px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  background-color: #f5f6f7;
  background-image: url("/static/search-icon.svg");
  background-size: ${({ boxHeight }) => (boxHeight ? boxHeight / 2 : 18)}px;
  background-position: ${({ boxHeight }) => (boxHeight ? boxHeight / 4 : 9)}px;
  background-repeat: no-repeat;
`;

export default SearchBox;
