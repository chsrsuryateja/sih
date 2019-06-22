import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tnpbase from "../api/tnpbase";

class Page extends React.Component {
  state = {
    driveName: "",
    drives: [],
    rounds: [],
    date: null,
    studentDetails: [],
    values: ["P", "A"],
    detailEdit: []
  };

  getDrives = dateDetail => {
    let data = { date: new Date(dateDetail).toLocaleDateString("en-GB") };
    console.log(data);
    tnpbase
      .post("/drives/drivesList", data)
      .then(response => {
        this.setState({ drives: response.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getRoundsList = () => {
    let data = { date: this.state.date, driveName: this.state.driveName };
    tnpbase
      .post("/drives/roundList", data)
      .then(response => {
        this.setState({ rounds: response.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  buttonHandle = i =>
    this.state.detailEdit[i].editStatus ? (
      <div className="ui basic icon buttons">
        <button
          className="ui  button"
          style={{ margin: "5px" }}
          onClick={() => {
            let data = {
              HTNO: this.state.studentDetails[i].HTNO,
              roundName: this.state.studentDetails[i].roundName,
              attendanceStatus : this.state.studentDetails[i].attendanceStatus
            };
            tnpbase
             .post("/drives/performance/editDetail", data)
             .then((result)=>{
               let ups = this.state.detailEdit;
               ups[i].editStatus = ! ups[i].editStatus;
               this.setState({studentDetails : result.data , detailEdit : ups});
             })
          }}
        >
          <i className="check icon" />
        </button>
        <button
          className="ui  button"
          onClick={() => {
            let ups = this.state.detailEdit;
            ups[i].editStatus = !ups[i].editStatus;
            this.state.studentDetails[i].roundName = ups[i].initialRoundName;
            this.state.studentDetails[i].attendanceStatus = ups[i].initialAttendanceStatus;
            this.setState({detailEdit : ups});
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
            let ups = this.state.detailEdit;
            ups[i].editStatus = !ups[i].editStatus;
            this.setState({detailEdit : ups});
          }
        }
        >
          <i className="pencil alternate icon" />
          Edit
        </button>
      </div>
    );

  tableData = () => {
    this.getRoundsList();
    if(this.state.studentDetails.length === 0) {
      return (
        <tr>
          <td colSpan={4}>It's Lonely Here</td>
        </tr>
      );
    }
    return this.state.studentDetails.map((number, i) => {
      return (
        <tr key={i}>
          <td>{number.HTNO}</td>
          <td>
            {this.state.detailEdit[i].editStatus ? (
              <select
                className="ui search dropdown"
                defaultValue={number.roundName}
                onChange={e => {
                  console.log("Selected val, directly" + e.target.value);
                  number.roundName = e.target.value;
                }}
              >
                {this.state.rounds.map(round => (
                  <option value={round}>{round}</option>
                ))}
              </select>
            ) : (
              number.roundName
            )}
          </td>
          <td>
            {this.state.detailEdit[i].editStatus ? (
              <select
                className="ui search dropdown"
                defaultValue={number.attendanceStatus}
                onChange={e => {
                  number.attendanceStatus = e.target.value;
                }}
              >
                {this.state.values.map(status => (
                  <option value={status}>{status}</option>
                ))}
              </select>
            ) : (
              number.roundName
            )}
          </td>
          <td>{this.buttonHandle(i)}</td>
        </tr>
      );
    });
  };

  enableTable = () => {
    let data = {
      date: new Date(this.state.date).toLocaleDateString("en-GB"),
      driveName: this.state.driveName
    };
    tnpbase
      .post("/drives/performance/driveDetails", data)
      .then(response => {
        console.log("Fetching Data");
        for (let i = 0; i < response.data.length; i++) {
          this.state.detailEdit.push({
            editStatus: false,
            initialRoundName: response.data[i].roundName,
            initialAttendanceStatus: response.data[i].attendanceStatus
          });
        }
        this.setState({ studentDetails: response.data });
      })
      .catch(err => {
        console.log(err);
      });

    console.log(data);
  };

  render() {
    let driveMenu = this.state.drives.map(drives => (
      <option value={drives}>{drives}</option>
    ));
    return (
      <div>
        <h1>Drive Performance</h1>
        <div className="ui form">
          <label>Select Date :</label>
          <br />
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={this.state.date}
            onChange={dateDetail => {
              console.log(this.state.date);
              this.getDrives(dateDetail);
              this.setState({ date: dateDetail });
            }}
          />
          <br />
          <label>Select Drive : </label>
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
          <button className="ui button" onClick={this.enableTable}>
            <i className="check icon" />
          </button>
        </div>
        <div>
          <br />
          <div className="ui container">
            <table className="ui blue table">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Round Name</th>
                  <th>Attendance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.tableData()}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
