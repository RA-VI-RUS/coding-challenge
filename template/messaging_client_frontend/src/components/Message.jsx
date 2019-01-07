import React from 'react';
import PropTypes from 'prop-types';

const messageAuthor = (message, patient) => (
  (message.direction === 'incoming') ? patient : message.uuid
);

const Message = ({ message, patient }) => (
  <div className="message">
    <div className="message-username">{`${messageAuthor(message, patient)}`}</div>
    <div className={`message-text ${message.direction}`}>{`${message.body}`}</div>
  </div>
);

const messagePropType = PropTypes.shape({
  uuid: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
});

Message.propTypes = {
  message: messagePropType.isRequired,
  patient: PropTypes.string.isRequired,
};

export default Message;
