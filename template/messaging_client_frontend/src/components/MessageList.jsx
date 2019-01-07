import React from 'react';
import PropTypes from 'prop-types';
import Message from './Message';

const MessageList = ({ messages, conversationId, patient }) => {
  if (!conversationId) {
    return (
      <div className="message-list">
        <div className="join-conversation">
          &larr; Join a conversation!
        </div>
      </div>
    );
  }
  return (
    <div className="message-list">
      {messages.map(msg => <Message key={msg.uuid} patient={patient} message={msg} />)}
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  conversationId: PropTypes.string.isRequired,
  patient: PropTypes.string.isRequired,
};

export default MessageList;
