import React, { Fragment } from "react";

interface IfPropTypes {
  condition: boolean
}

export const If:React.FunctionComponent<IfPropTypes> = (props) => {
  if (props.condition) {
    return <Fragment>{props.children}</Fragment>;
  }

  return null;
};
