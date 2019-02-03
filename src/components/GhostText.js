import React from 'react';

const GhostText = ({ attributes, children }) => {
  return (
    <span className="ghost-text" contentEditable={false}>
      {children}
    </span>
  );
};

export default GhostText;
