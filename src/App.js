import React from "react";
import { Route, Switch } from "react-router-dom";

import SideBar from "./components/SideBar";
import Navbar from "./components/Navbar";

import Dashboard from "./components/Dashboard";

import AddStudentsDisplay from "./components/AddStudents";
import FilterStudentsDisplay from "./components/FilterStudents";
import SearchStudentDisplay from "./components/SearchStudent";

import AddDriveDisplay from "./components/AddDrives/AddDrive";
import DriveViewDisplay from "./components/DrivesView/DriveView";
import RoundsConfigDisplay from "./components/RoundsConfig";

import DriveAttendanceDisplay from "./components/DriveAttendance";
import DrivePerformanceDisplay from "./components/DrivePerformance";

import NewTestDisplay from "./components/NewTestDisplay";
import TestPerformaceDisplay from "./components/TestPerformace";

import tnpbase from "./api/tnpbase";

import { fetchRounds, fetchYears } from "./actions";

import "./App.css";
import { connect } from "react-redux";

class App extends React.Component {
  state = {
    sidebarVisible: false,
    loading: false,
    error: "",
    message: "",
    submitted: false
  };

  handleMenuClick = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible });
  };

  handleXClick = () => {
    this.setState({ submitted: false });
  };

  FileUploadHandler = files => {
    this.setState({ submitted: true, loading: true });
    const formData = new FormData();
    Object.keys(files).forEach(key => {
      const file = files[key];
      formData.append(
        "file",
        new Blob([file], { type: file.type }),
        file.name || "file"
      );
    });
    tnpbase
      .post("/students/add/", formData)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            loading: false,
            message: res.data.status,
            error: ""
          });
        } else {
          this.setState({
            loading: false,
            error: res.data.status,
            message: res.data.error
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false,
          error: "Unable to submit data",
          message: err.message
        });
      });
  };

  componentDidMount = () => {
    this.props.fetchRounds();
    this.props.fetchYears();
  };

  render() {
    return (
      <div>
        <div>
          <Navbar handleMenuClick={this.handleMenuClick} />
          <SideBar
            isVisible={this.state.sidebarVisible}
            onClose={this.handleMenuClick}
          />

          <div style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route
                path="/students/add"
                render={() => (
                  <AddStudentsDisplay
                    handleUpload={this.FileUploadHandler}
                    message={this.state.message}
                    error={this.state.error}
                    loading={this.state.loading}
                    submitted={this.state.submitted}
                    handleXClick={this.handleXClick}
                  />
                )}
              />
              <Route path="/students/search" component={SearchStudentDisplay} />
              <Route
                path="/students/filter"
                component={FilterStudentsDisplay}
              />
              <Route path="/drives/add" component={AddDriveDisplay} />
              <Route path="/drives/view" component={DriveViewDisplay} />
              <Route path="/rounds/config" component={RoundsConfigDisplay} />
              <Route
                path="/drives/attendance"
                component={DriveAttendanceDisplay}
              />
              <Route
                path="/drives/performance"
                component={DrivePerformanceDisplay}
              />
              <Route path="/tests/new" component={NewTestDisplay} />
              <Route
                path="/tests/performance"
                component={TestPerformaceDisplay}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { fetchRounds, fetchYears }
)(App);
