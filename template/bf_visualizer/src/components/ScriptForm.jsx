import { Component } from 'react';
import PropTypes from 'prop-types';

class ScriptForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      script: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ script: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitScript(this.state.script);
  }

  render() {
    return (
      <div className="script-editor">
        <div className="script-form">
          <h3>Edit Script</h3>
          <form
            id="scriptform"
            onSubmit={this.handleSubmit}
          >
            <textarea
              onChange={this.handleChange}
              value={this.state.script}
              placeholder="New script"
              type="text"
            />
          </form>
        </div>
        <div className="script-submit">
          <input type="submit" form="scriptform" />
        </div>
      </div>
    );
  }
}

ScriptForm.propTypes = {
  submitScript: PropTypes.func.isRequired,
};

export default ScriptForm;
