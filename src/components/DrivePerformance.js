import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tnpbase from "../api/tnpbase";

class Page extends React.Component {
  state = {
    drive_id: 0,
    drives: [],
    rounds: [],
    date: null,
    studentDetails: [],
    values: ["P", "A"],
    selectionStatus: ["Selected", "Not Selected"],
    offerStatus: ["Submitted", "Not Submitted"],
    detailEdit: []
  };

  getDrives = dateDetail => {
    const data = { date: new Date(dateDetail).toLocaleDateString("en-GB") };
    tnpbase
      .post("/drives/drivesList", data)
      .then(response => {
        this.setState({ drives: response.data });
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
              drive_id: this.state.drive_id,
              HTNO: this.state.studentDetails[i].HTNO,
              round_name: this.state.studentDetails[i].round_name,
              attendanceStatus: this.state.studentDetails[i].attendance_status,
              selected: this.state.studentDetails[i].selected,
              offer_letter: this.state.studentDetails[i].offer_letter
            };
            tnpbase
              .post("/drives/performance/editDetail", data)
              .then(result => {
                let ups = this.state.detailEdit;
                ups[i].editStatus = !ups[i].editStatus;
                ups[i].initialRoundName = this.state.studentDetails[
                  i
                ].round_name;
                ups[i].initialAttendanceStatus = this.state.studentDetails[
                  i
                ].attendance_status;
                ups[i].initialSelectStatus = this.state.studentDetails[
                  i
                ].selected;
                ups[i].initialOfferStatus = this.state.studentDetails[
                  i
                ].offer_letter;
                this.getDrives();
                this.setState({ detailEdit: ups });
              });
          }}
        >
          <i className="check icon" />
        </button>
        <button
          className="ui  button"
          onClick={() => {
            let ups = this.state.detailEdit;
            let students = this.state.studentDetails;
            ups[i].editStatus = !ups[i].editStatus;
            students[i].round_name = ups[i].initialRoundName;
            students[i].attendance_status = ups[i].initialAttendanceStatus;
            students[i].selected = ups[i].initialSelectStatus;
            students[i].offer_letter = ups[i].initialOfferStatus;
            this.setState({ detailEdit: ups, studentDetails: students });
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
            this.setState({ detailEdit: ups });
          }}
        >
          <i className="pencil alternate icon" />
          Edit
        </button>
      </div>
    );

  tableData = () => {
    if (this.state.studentDetails.length === 0) {
      return (
        <tr>
          <td colSpan={6}>It's Lonely Here</td>
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
                defaultValue={number.round_name}
                onChange={e => {
                  number.round_name = e.target.value;
                }}
              >
                {this.state.rounds.map(round => (
                  <option value={round.round_name}>{round.round_name}</option>
                ))}
              </select>
            ) : (
              number.round_name
            )}
          </td>
          <td>
            {this.state.detailEdit[i].editStatus ? (
              <select
                className="ui search dropdown"
                defaultValue={number.attendance_status}
                onChange={e => {
                  number.attendance_status = e.target.value;
                }}
              >
                {this.state.values.map(status => (
                  <option value={status}>{status}</option>
                ))}
              </select>
            ) : (
              number.attendance_status
            )}
          </td>
          <td>
            {this.state.detailEdit[i].editStatus ? (
              <select
                className="ui search dropdown"
                defaultValue={number.selected}
                onChange={e => {
                  number.selected = e.target.value;
                }}
              >
                {this.state.selectionStatus.map(selection => (
                  <option value={selection}>{selection}</option>
                ))}
              </select>
            ) : (
              number.selected
            )}
          </td>
          <td>
            {this.state.detailEdit[i].editStatus ? (
              <select
                className="ui search dropdown"
                defaultValue={number.offer_letter}
                onChange={e => {
                  number.offer_letter = e.target.value;
                }}
              >
                {this.state.offerStatus.map(selection => (
                  <option value={selection}>{selection}</option>
                ))}
              </select>
            ) : (
              number.offer_letter
            )}
          </td>
          <td>{this.buttonHandle(i)}</td>
        </tr>
      );
    });
  };
  enableTable = () => {
    let data = {
      drive_id: this.state.drive_id
    };
    tnpbase
      .post("/drives/performance/driveDetails", data)
      .then(response => {
        console.log("Fetching Data");
        for (let i = 0; i < response.data.students.length; i++) {
          this.state.detailEdit.push({
            editStatus: false,
            initialRoundName: response.data.students[i].round_name,
            initialAttendanceStatus:
              response.data.students[i].attendance_status,
            initialSelectStatus: response.data.students[i].selected,
            initialOfferStatus: response.data.students[i].offer_letter
          });
        }
        this.setState({
          studentDetails: response.data.students,
          rounds: response.data.rounds
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    let driveMenu = this.state.drives.map(drives => (
      <option value={drives.drive_id}>{drives.company}</option>
    ));

    return (
      <div>
        <div className="ui container">
          <h3 className="ui center aligned icon header">
            <i className="cogs icon" />
            <div className="content">
              Drive Performance
              <div className="sub header">Student Performance</div>
            </div>
          </h3>
        
        <div className="ui form">
          <label>Select Date :</label>
          <br/>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={this.state.date}
            onChange={dateDetail => {
              this.getDrives(dateDetail);
              this.setState({ date: dateDetail });
            }}
          />
          <br />
          <label>Select Drive : </label>
          <select
            className="ui search dropdown"
            value={this.state.drive_id}
            onChange={e => {
              this.setState({ drive_id: e.target.value });
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
                  <th>Selected</th>
                  <th>Offer Letter</th>
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
