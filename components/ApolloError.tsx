import React from "react";
import { ApolloError } from "apollo-client";
import styled from "styled-components";

export interface ErrorMessageProps {
  error: ApolloError;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error || !error.message) return null;

  return (
    <ErrorMessageStyles>
      <span>An error occured:</span>
      <span>{error.message.replace("GraphQL error: ", "")}</span>
    </ErrorMessageStyles>
  );
};

export default ErrorMessage;

const ErrorMessageStyles = styled.div`
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  position: absolute;
  bottom: 15px;
  right: 15px;
  background: red;
  border-radius: 5px;
  padding: 10px 15px;
  animation: fade-in 0.75s;

  span:first-child {
    margin-right: 5px;
  }
`;