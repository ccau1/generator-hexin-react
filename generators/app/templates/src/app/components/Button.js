import React from 'react';
// import styled from 'styled-components';
import {FlatButton, RaisedButton} from 'material-ui';


export const Default = ({children, ...props}: Object) => {
  return (
    <RaisedButton {...props}>
      {children}
    </RaisedButton>
  );
};

export const Primary = ({children, ...props}: Object) => {
  return (
    <RaisedButton primary={true} {...props}>
      {children}
    </RaisedButton>
  );
};

export const Secondary = ({children, ...props}: Object) => {
  return (
    <RaisedButton secondary={true} {...props}>
      {children}
    </RaisedButton>
  );
};

export const Link = ({children, ...props}: Object) => {
  return (
    <FlatButton {...props}>
      {children}
    </FlatButton>
  );
};

export default Default;
