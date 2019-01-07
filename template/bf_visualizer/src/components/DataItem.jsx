import React from 'react';
import PropTypes from 'prop-types';

const DataItem = ({ index, item, bold }) => (
  <li key={index} className="data">
    <span className={`data-index ${bold ? 'bold' : ''}`}>
      {index}
    </span>
    <span className={`data-item ${bold ? 'bold' : ''}`}>
      {item}
    </span>
    <span className={`data-item ${bold ? 'bold' : ''}`}>
      {String.fromCharCode(item)}
    </span>
  </li>
);

DataItem.propTypes = {
  item: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  bold: PropTypes.bool.isRequired,
};

export default DataItem;
