import { Component } from 'react';
import PropTypes from 'prop-types';

class FilterConversationsForm extends Component {
  constructor() {
    super();
    this.state = {
      patientName: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      patientName: e.target.value,
    });
    this.props.filterConversations(e.target.value);
  }

  render() {
    return (
      <div className="filter-conversation-form">
        <form onSubmit={this.handleSubmit} >
          <input
            value={this.state.patientName}
            onChange={this.handleChange}
            type="text"
            placeholder="Filter By Name"
          />
        </form>
      </div>
    );
  }
}

FilterConversationsForm.propTypes = {
  filterConversations: PropTypes.func.isRequired,
};

export default FilterConversationsForm;
