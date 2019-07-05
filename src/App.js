import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

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

import LoginPage from "./components/LoginPage";

import tnpbase from "./api/tnpbase";

import { fetchRounds, fetchYears } from "./actions";

import AddUser from "./components/AddUser";

import "./App.css";
import { connect } from "react-redux";
import logo from "./images/logo.png";
import ResetUser from "./components/ResetUser";
import DeleteUser from "./components/DeleteUser";

class App extends React.Component {
  state = {
    sidebarVisible: false,
    loading: false,
    error: "",
    message: "",
    submitted: false,
    login: false,
    currentUser: "",
    userRole: "",
    loginError: ""
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

  handleLogin = (user, password) => {
    this.setState({loginError: "Loading..."})
    const data = { user, password };
    tnpbase
      .post("/login/page", { data })
      .then(res => {
        if(res.data.login) {
          sessionStorage.setItem("login", true);
          sessionStorage.setItem("currentUser", res.data.user);
          sessionStorage.setItem("userRole", res.data.role);
          sessionStorage.setItem("branch",res.data.branch);
          // window.location.reload();
          this.props.history.push("/");
        }
        this.setState({ loginError: res.data.status });
      })
      .catch(err => {
        console.log(err);
        this.setState({loginError: err.message})
      });
  };

  handleLogout = () => {
    sessionStorage.setItem("login",false);
    sessionStorage.setItem("currentUser","");
    sessionStorage.setItem("userRole", "");
    window.location.reload();
  }

  displayInnerContent = () => {
    if (sessionStorage.getItem("userRole") === "ADMIN") {
      return (
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
          <Route path="/user/add" component={AddUser} />
          <Route path="/students/filter" component={FilterStudentsDisplay} />
          <Route path="/drives/add" component={AddDriveDisplay} />
          <Route path="/drives/view" component={DriveViewDisplay} />
          <Route path="/rounds/config" component={RoundsConfigDisplay} />
          <Route path="/drives/attendance" component={DriveAttendanceDisplay} />
          <Route
            path="/drives/performance"
            component={DrivePerformanceDisplay}
          />
          <Route path="/tests/new" component={NewTestDisplay} />
          <Route path="/tests/performance" component={TestPerformaceDisplay} />
          <Route path="/user/reset" component={ResetUser} />
          <Route path="/user/delete" component={DeleteUser} />
        </Switch>
      );
    } else if (sessionStorage.getItem("userRole")=== "TPO") {
      return (
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
          <Route path="/students/filter" component={FilterStudentsDisplay} />
          <Route path="/drives/add" component={AddDriveDisplay} />
          <Route path="/drives/view" component={DriveViewDisplay} />
          <Route path="/rounds/config" component={RoundsConfigDisplay} />
          <Route path="/drives/attendance" component={DriveAttendanceDisplay} />
          <Route
            path="/drives/performance"
            component={DrivePerformanceDisplay}
          />
          <Route path="/tests/new" component={NewTestDisplay} />
          <Route path="/tests/performance" component={TestPerformaceDisplay} />
         
        </Switch>
      );
    } else if (sessionStorage.getItem("userRole") === "PCO") {
      return (
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/drives/view" component={DriveViewDisplay} />
          <Route
            path="/drives/performance"
            component={DrivePerformanceDisplay}
          />
          <Route path="/tests/performance" component={TestPerformaceDisplay} />
        </Switch>
      );
    }
  };

  displayContent = () => {
    if (JSON.parse(sessionStorage.getItem("login")) === true) {
      return (
        <div>
          <Navbar handleMenuClick={this.handleMenuClick} handleLogout={this.handleLogout} user={sessionStorage.getItem("currentUser")}/>
          <SideBar
            isVisible={this.state.sidebarVisible}
            onClose={this.handleMenuClick}
            userRole={sessionStorage.getItem("userRole")}
          />

          <div style={{ marginLeft: "10px", marginRight: "10px" }}>
            {this.displayInnerContent()}
          </div>
        </div>
      );
    } else {
      return <LoginPage handleLogin={this.handleLogin} loginError={this.state.loginError}/>;
    }
  };

  render() {
    return (
      <div>
        <div style={{ backgroundColor: "#1b181a" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              height: "60px"
            }}
          />
        </div>
        {this.displayContent()}
      </div>
    );
  }
}

export default withRouter(connect(
  null,
  { fetchRounds, fetchYears }
)(App));
