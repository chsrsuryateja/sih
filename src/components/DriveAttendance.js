import React from "react";
import tnpbase from "../api/tnpbase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class DriveAttendance extends React.Component {
  state = {
    drives: [],
    driveName: "",
    date: null,
    values : ['P','A'],
    attendanceDetails: [],
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
    let data = {
      drive: this.state.driveName,
      date: new Date(this.state.date).toLocaleDateString("en-GB")
    };
    console.log(data);
    tnpbase
      .post("/drives/attendance/getDriveDetails", data)
      .then(() => {
        console.log("Fetching");
        this.getStudentDetails();
      })
      .catch(err => {
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

    for (let i = 0; i < this.state.studentDetails.length; i++) {
      this.state.attendanceDetails.push({
        editStatus: false,
        studentStatus: this.state.studentDetails[i].attendanceStatus
      });
    }
  };

  buttonHandle = i =>
    this.state.attendanceDetails[i].editStatus ? (
      <div className="ui basic icon buttons">
        <button
          className="ui  button"
          style={{ margin: "5px" }}
          onClick={() => {
            let data = {
              HTNO: this.state.studentDetails[i].HTNO,
              attendanceStatus : this.state.studentDetails[i].attendanceStatus
            };
            tnpbase
            .post("/drives/performance/editDetail", data)
            this.state.attendanceDetails[i].editStatus = !this.state.attendanceDetails[i].editStatus;
            console.log(this.state.attendanceDetails);
          }}
        >
          <i className="check icon" />
        </button>
        <button
          className="ui  button"
          onClick={() => {
            this.state.attendanceDetails[i].editStatus = !this.state.attendanceDetails[i].editStatus;
            console.log(this.state.attendanceDetails);
          }}
        >
          <i className="x icon" />
        </button>
      </div>
    ) : (
      <div>
        <button
          className="ui  secondary button"
          style={{ margin: "5px" }}
          onClick={() => {
            this.state.attendanceDetails[i].editStatus = !this.state.attendanceDetails[i].editStatus;
            // console.log(this.state.attendanceDetails[i].editStatus)
          }}
        >
          <i className="pencil alternate icon" />
          Edit
        </button>
      </div>
    );

  tableData = () => {
    return this.state.studentDetails.map((number, i) => {
      return (
        <tr key={i}>
          <td>{number.HTNO}</td>
          <td>
            {this.state.attendanceDetails[i].editStatus ? (
              <select
                className="ui search dropdown"
                defaultValue={number.attendanceStatus}
                onChange={e => {
                  console.log("Selected val, directly" + e.target.value);
                  number.attendanceStatus = e.target.value;
                }}
              >
                {this.state.values.map(round => (
                  <option value={round}>{round}</option>
                ))}
              </select>
            ) : (
              number.attendanceStatus
            )}
          </td>
          <td>{this.buttonHandle(i)}</td>
        </tr>
      );
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
