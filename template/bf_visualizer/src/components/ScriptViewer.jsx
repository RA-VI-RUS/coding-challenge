import React from 'react';
import PropTypes from 'prop-types';

const ScriptViewer = ({ script, iPtr }) => {
  const leftCode = script.slice(0, iPtr);
  const currentInstruction = script.slice(iPtr, iPtr + 1);
  const rightCode = script.slice(iPtr + 1);

  return (
    <div className="script-viewer">
      <h3>Running Script</h3>
      <span>{leftCode}</span>
      <span className="current">{currentInstruction}</span>
      <span>{rightCode}</span>
    </div>
  );
};

ScriptViewer.propTypes = {
  script: PropTypes.arrayOf(PropTypes.string).isRequired,
  iPtr: PropTypes.number.isRequired,
};

export default ScriptViewer;
