import React from 'react';
import PropTypes from 'prop-types';

const InputArea = ({ handleInputChange, inputValue }) => (
  <div className="input-buffer">
    <h3>Input</h3>
    <textarea
      onChange={handleInputChange}
      value={inputValue}
    />
  </div>
);

InputArea.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
};

export default InputArea;
