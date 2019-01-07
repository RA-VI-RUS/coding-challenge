import React from 'react';
import PropTypes from 'prop-types';

const ProgramCounterDisplay = ({
  iPtrString, handleBack, handleNext, handleFirst, handleLast,
}) => (
  <div className="program-counter">
    <button className="step" onClick={handleFirst}>{'<< First'}</button>
    <button className="step" onClick={handleBack}>{'< Back'}</button>
    <span className="iPtrString">{`Instruction Pointer: ${iPtrString}`}</span>
    <button className="step" onClick={handleNext}>{'Next >'}</button>
    <button className="step" onClick={handleLast}>{'Last >>'}</button>
  </div>
);

ProgramCounterDisplay.propTypes = {
  iPtrString: PropTypes.string.isRequired,
  handleFirst: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleLast: PropTypes.func.isRequired,
};

export default ProgramCounterDisplay;
