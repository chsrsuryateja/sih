import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tnpbase from "../api/tnpbase";
import ErrorDisplay from './ui_utils/ErrorDisplay';

class Page extends React.Component {
  state = {
    drive_id: 0,
    drives: [],
    rounds: [],
    date: null,
    studentDetails: [],
    values: ["P", "A"],
    showMessage: false,
    selectionStatus: ["Selected", "Not Selected"],
    offerStatus: ["Submitted", "Not Submitted"],
    detailEdit: [],
    loading: false,
    error: "",
    message: "",
    submitted: false
  };

  getDriveData = () => {
    let data = {
      drive_id: this.state.drive_id
    };
    tnpbase
      .post("/drives/performance/driveDetails", data)
      .then(response => {
        this.setState({submitted : true,loading : true});
        if (response.status === 200) {
          if (response.data.result.length !== 0) {
            console.log("Fetching Data");
            for (let i = 0; i < response.data.result[0].length; i++) {
              this.state.detailEdit.push({
                editStatus: false,
                initialRoundName: response.data.result[0][i].round_name,
                initialAttendanceStatus:
                  response.data.result[0][i].attendance_status,
                initialSelectStatus: response.data.result[0][i].selected,
                initialOfferStatus: response.data.result[0][i].offer_letter
              });
            }
            this.setState({
              studentDetails: response.data.result[0],
              rounds: response.data.result[1],
              loading : false,
              message : response.data.status,
              error : ""
            });
          } else {
            this.setState({studentDetails : [], rounds : [] , loading : false , error : response.data.status, message : response.data.error});
          }
        } else {
          this.setState({
            loading : false,
            error : response.data.status,
            message : response.data.error
          });
        }
        
      })
      .catch(err => {
        console.log(err);
        this.setState({
          submitted:true,
          loading : false,
          message : err.message,
          error : "Unable to send data"
        });
      });
  };

  getDrives = dateDetail => {
    const data = { date: new Date(dateDetail).toLocaleDateString("en-GB") };
    tnpbase
      .post("/drives/drivesList", { data })
      .then(response => {
        if (response.status === 200) {
          if (response.data.length !== 0) {
            this.setState({ drives: response.data });
          } else {
            window.alert(`No drives`)
          }
        }
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
                this.getDrives(this.state.date);
                this.setState({ detailEdit: ups });
                window.alert('Submit successfull');
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

  handleXClick = () => {
    this.setState({ submitted: false });
  };

  displayMessage = () => {
    if (this.state.submitted) {
      if (this.state.loading) {
        return <h1>Loading</h1>
      } else if (this.state.error !== "") {  
        return (
          <ErrorDisplay
            headerData={this.state.error}
            message={this.state.message}
            showTry={false}
            handleXclick={this.handleXclick}
          />
        );
      }
    }
  }

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
                {this.state.rounds.map((round,index) => (
                  <option key ={index}   value={round.round_name}>{round.round_name}</option>
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
                {this.state.values.map((status,index) => (
                  <option key ={index}   value={status}>{status}</option>
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
                {this.state.selectionStatus.map((selection,index) => (
                  <option key ={index}   value={selection}>{selection}</option>
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
                {this.state.offerStatus.map((selection,index) => (
                  <option key ={index}   value={selection}>{selection}</option>
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

  enableTable = () =>{
    this.setState({showMessage: true})
  }

  render() {
    let driveMenu = this.state.drives.map((drives, index) => (
      <option key={index} value={drives.drive_id}>{drives.company}</option>
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
            <br />
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
            <button className="ui button" onClick={() => {
              this.enableTable();
              this.getDriveData();
            }
            }>
              <i className="check icon" />
            </button>
          </div>
          <div>
            <br/>
            {this.displayMessage()}
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
