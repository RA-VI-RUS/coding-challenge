import { Component } from 'react';
import ConversationList from './components/ConversationList';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import FilterConversationsForm from './components/FilterConversationsForm';
import { user, apiUrl } from './config';
import './App.css';

const quickUUID = () => {
  const s = n => parseInt(Math.random() * (16 ** n), 10).toString(16);
  return `${s(8)}-${s(4)}-${s(4)}-${s(4)}-${s(8)}`;
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      conversations: [],
      filteredConversations: [],
      messages: [],
      conversationId: null,
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToConversation = this.subscribeToConversation.bind(this);
    this.getPatientName = this.getPatientName.bind(this);
    this.filterConversations = this.filterConversations.bind(this);
    this.getConversations = this.getConversations.bind(this);
  }

  componentDidMount() {
    const conversationId = localStorage.getItem('conversationId');
    this.getConversations(conversationId);
    if (conversationId) { this.getMessages(conversationId); }
  }

  getConversations(conversationId) {
    fetch(`${apiUrl}?${user}`)
      .then(response => response.json())
      .then(json => this.setState({
        conversations: json.data,
        filteredConversations: json.data,
        conversationId,
      }))
      .catch(error => console.error('error on fetch conversation data: ', error));
  }

  getMessages(conversationId) {
    const cachedMessages = localStorage.getItem(conversationId);

    if (cachedMessages) {
      this.setState({
        messages: [...JSON.parse(cachedMessages)],
      });
      return;
    }

    fetch(`${apiUrl}/${conversationId}?${user}`)
      .then(response => response.json())
      .then(json => this.setState({
        messages: [...this.state.messages, ...json.data.messages],
      }))
      .catch(error => console.error('error on fetch messages: ', error));
  }

  getPatientName() {
    const id = this.state.conversationId;
    if (id) {
      const conversations = this.state.conversations.slice();
      return conversations.filter(c => c.uuid === id)[0].name;
    }
    return '';
  }

  sendMessage(text) {
    const message = {
      uuid: quickUUID(),
      body: text,
      direction: 'outgoing',
      created_at: Date(Date.now()).toString(),
    };

    localStorage.setItem(
      this.state.conversationId,
      JSON.stringify([...this.state.messages, message]),
    );

    this.setState(state => ({
      messages: [...state.messages, message],
    }));
  }

  subscribeToConversation(conversationId) {
    localStorage.setItem('conversationId', conversationId);
    this.setState({
      messages: [],
      conversationId,
    });
    this.getMessages(conversationId);
  }

  filterConversations(patientName) {
    const regex = new RegExp(`^${patientName}`, 'i');
    const conversations = this.state.conversations.slice();
    const filtered = conversations.filter(c => c.name.match(regex));
    this.setState({ filteredConversations: [...filtered] });

    const joined = filtered.some(c => c.uuid === this.state.conversationId);
    if (!joined) {
      localStorage.removeItem('conversationId');
      this.setState({
        messages: [],
        conversationId: null,
      });
    }
  }

  render() {
    return (
      <div className="app">
        <ConversationList
          conversationId={this.state.conversationId}
          subscribeToConversation={this.subscribeToConversation}
          conversations={this.state.filteredConversations}
        />
        <MessageList
          messages={this.state.messages}
          conversationId={this.state.conversationId}
          patient={this.getPatientName()}
        />
        <SendMessageForm
          sendMessage={this.sendMessage}
          disabled={!this.state.conversationId}
        />
        <FilterConversationsForm
          filterConversations={this.filterConversations}
        />
      </div>
    );
  }
}

export default App;
