import React from "react";
import { Link } from "react-router-dom";

const Navbar = props => {
  return (
    <div className="ui inverted menu " style={{ borderRadius: 0.5, marginTop: 0, borderTop: "0.5px solid white" }}>
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
          {props.user}
        </a>
         {/*eslint-disable-next-line*/}
        <a className="ui item" onClick={props.handleLogout}>
          Logout
        </a>
      </div>
    </div>
  );
};

export default Navbar;
