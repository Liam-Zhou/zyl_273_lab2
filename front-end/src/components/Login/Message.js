import React from "react";
import { connect } from "react-redux";
const messageShow = ({ message }) => (
    <div><h4>{message}</h4></div>
);
const mapStateToProps = state => {
  console.log('state in message',state)
  return { message: state.message };
};
const Message = connect(mapStateToProps)(messageShow);
export default Message;