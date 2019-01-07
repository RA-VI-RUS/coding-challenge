import React from 'react';
import PropTypes from 'prop-types';

const sorted = conversations => [...conversations].sort((a, b) => {
  const t1 = new Date(a.last_message.created_at);
  const t2 = new Date(b.last_message.created_at);
  return t1 - t2;
});

const ConversationList = ({ subscribeToConversation, conversations, conversationId }) => (
  <div className="conversations-list">
    <ul>
      <h3>Your conversations:</h3>
      {sorted(conversations).map((conversation) => {
        const active = conversationId === conversation.uuid ? 'active' : '';
        return (
          <li key={conversation.uuid} className={`conversation ${active}`}>
            <button onClick={() => subscribeToConversation(conversation.uuid)} >
              <p>{conversation.name}</p>
              <p>{`${conversation.unread} unread`}</p>
              <p>{`Last message on ${(new Date(conversation.last_message.created_at)).toUTCString()}`}</p>
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);

ConversationList.propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.object).isRequired,
  subscribeToConversation: PropTypes.func.isRequired,
  conversationId: PropTypes.string.isRequired,
};

export default ConversationList;
