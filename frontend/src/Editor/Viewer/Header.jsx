import React from 'react';
import classNames from 'classnames';

const Header = ({ children, className, styles = {}, showNavbarClass = true }) => {
  return (
    <div
      style={{
        minHeight: '0px',
        ...styles,
      }}
      // className={`header ${className}`}
    >
      {/* <header className={classNames({ 'navbar navbar-expand-md': showNavbarClass })}> */}
      {/* <div className="container-xl header-container position-relative">{children}</div> */}
      {/* </header> */}
    </div>
  );
};

export default Header;
