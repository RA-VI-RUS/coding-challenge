import React from 'react';
import PropTypes from 'prop-types';

const OutputArea = ({ output }) => (
  <div className="output-buffer">
    <h3>Output</h3>
    <div>
      {output}
    </div>
  </div>
);

OutputArea.defaultProps = {
  output: '',
};

OutputArea.propTypes = {
  output: PropTypes.string,
};

export default OutputArea;
