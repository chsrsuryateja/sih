import React from "react";
import tnpbase from "../api/tnpbase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class DriveAttendance extends React.Component {
  state = {
    drives: [],
    driveName: "",
    date: null,
    studentDetails: []
  };

  componentDidMount = () => {
    tnpbase
      .get("/drives/attendence")
      .then(response => {
        this.setState({ drives: response.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getTable = () => {
    console.log("Hello");
    let data = { drive: this.state.driveName, date: this.state.date };
    tnpbase
      .post("/drives/attendance/getDriveDetails", data)
      .then(() => {
        console.log("Fetching");
        this.getStudentDetails();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getStudentDetails = () => {
    tnpbase
      .get("/drives/performance/getStudentDetails")
      .then(response => {
        this.setState({ studentDetails: response.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let driveMenu = this.state.drives.map(drives => (
      <option value={drives}>{drives}</option>
    ));
    return (
      <div>
        <h1>Drive Attendance</h1>
        <div className="ui input">
          <form className="ui form">
            <label>Select Drive: </label>
            <select
              className="ui search dropdown"
              value={this.state.driveName}
              onChange={e => {
                this.setState({ driveName: e.target.value });
              }}
            >
              <option value="">Select Drive</option>
              {driveMenu}
            </select>
            <br />
            <label>Select Date: </label>
            <br />
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={this.state.date}
              onChange={dateDetail => {
                console.log(this.state.date);
                this.setState({ date: dateDetail });
              }}
            />
          </form>
          <br />
        </div>
        <div>
          <br />
          <button className="ui button">
            <i className="check icon" onClick={this.getTable} />
          </button>
        </div>
        <div>
          <br />
          <div className="ui container">
            <table className="ui blue table">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Attendance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody />
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default DriveAttendance;
