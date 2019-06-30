import React from "react";
import { Link } from "react-router-dom";

const SideBar = props => {
  return (
    <div
      className={`ui left vertical inverted menu sidebar ${
        props.isVisible ? "visible" : ""
      } `}
      onClick={props.onClose}
    >
      <div className="item">
        <button className="ui icon button inverted" onClick={props.onClose}>
          <i className="close icon " />
        </button>
      </div>
      <div
        className="item"
        style={{ display: props.userRole === "PCO" ? "none" : "" }}
      >
        <div className="header">Student Details</div>
        <div className="menu">
          <Link to="/students/add" className="item">
            Import Student DB
          </Link>
          <Link to="/students/filter" className="item">
            Filter Students
          </Link>
          <Link to="/students/search" className="item">
            Search Student
          </Link>
        </div>
      </div>
      <div className="item">
        <div className="header">Drive Management</div>
        <div className="menu">
          <Link to="/drives/view" className="item">
            View Drives
          </Link>
          <Link
            to="/drives/add"
            className="item"
            style={{ display: props.userRole === "PCO" ? "none" : "" }}
          >
            Add Drive
          </Link>
          <Link
            to="/rounds/config"
            className="item"
            style={{ display: props.userRole === "PCO" ? "none" : "" }}
          >
            Rounds Configuration
          </Link>
        </div>
      </div>
      <div className="item">
        <div className="header">Drive Reports</div>
        <div className="menu">
          <Link to="/drives/performance" className="item">
            Student Performance in Drive
          </Link>
        </div>
      </div>
      <div className="item">
        <div className="header">Training Tests</div>
        <div className="menu">
          <Link
            to="/tests/new"
            className="item"
            style={{ display: props.userRole === "PCO" ? "none" : "" }}
          >
            New Test
          </Link>
          <Link to="/tests/performance" className="item">
            Test Performance
          </Link>
        </div>
      </div>
      <div
        className="item"
        style={{ display: props.userRole === "ADMIN" ? "" : "none" }}
      >
        <div className="header">Support</div>
        <div className="menu">
          <Link to="/user/add" className="item">
            Add User
          </Link>
          <Link to="/user/reset" className="item">
            Reset Password
          </Link>
          <Link to="/user/delete" className="item">
            Delete Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
