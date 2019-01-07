import React from 'react';
import PropTypes from 'prop-types';
import DataItem from './DataItem';

const visibleLines = 45;

const first = dPtr => Math.max(0, dPtr - (visibleLines / 2));

const dataWindow = (data, dPtr) => {
  const last = first(dPtr) + visibleLines;
  return data.slice(first, last);
};

const current = (index, dPtr) => index + first(dPtr) === dPtr;

const DataViewer = ({ data, dPtr }) => (
  <div className="data-viewer">
    <ul>
      <h3>Data Pointer: {dPtr}</h3>
      {dataWindow(data, dPtr).map((item, index) =>
        <DataItem index={index} item={item} bold={current(index, dPtr)} />)}
    </ul>
  </div>
);

DataViewer.defaultProps = {
  dPtr: 0,
};

DataViewer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  dPtr: PropTypes.number,
};

export default DataViewer;
