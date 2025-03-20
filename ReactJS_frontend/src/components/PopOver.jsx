import React from "react";

const PopOver = ({ position = "left", show = false, children }) => {
  return (
    <div className={`pop-over ${position} ${show ? '' : 'hide'}`}>
      {children}
    </div>
  );
};

export default PopOver;
