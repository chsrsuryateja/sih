import React from "react";
import { Link } from "react-router-dom";

const Navbar = props => {
  return (
    <div className="ui inverted blue menu " style={{ borderRadius: 0.5 }}>
      {/*eslint-disable-next-line*/}
      <a className="item" onClick={props.handleMenuClick}>
        <i className="sidebar icon" />
        Menu
      </a>
      <Link to="/" className="item">
        Home
      </Link>
      <div className="right menu">
         {/*eslint-disable-next-line*/}
        <a className="ui item">
          Logout
        </a>
      </div>
    </div>
  );
};

export default Navbar;
