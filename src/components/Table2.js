import React from "react";
import { connect } from "react-redux";
import { FetchPerfData } from "../actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tnpbase from "../api/tnpbase";

class Page extends React.Component {
  state = {
    showTable: false,
    driveName: "",
    drives: [],
    rounds: [],
    date: null,
    studentDetails: [],
    detailEdit: []
  };

  componentDidMount = () => {
    this.getData();
  };

  getData = () => {
    tnpbase
      .get("/drive/performance")
      .then(response => {
        this.setState({
          drives: response.data[0],
          studentDetails : response.data[1],
          rounds: response.data[2]
        });

        for (let i = 0; i < this.state.studentDetails.length; i++) {
          this.state.detailEdit.push({
            editStatus: false,
            initial: this.state.studentDetails[i].roundName
          });
        }
      })
      .catch(err => console.log(err));
  };

  enableTable = () => {
    let data = { driveName: this.state.driveName, date: this.state.date };
    tnpbase
      .post("/drives/performance/driveDetails", data)
      .then(() => {
        console.log("Fetching Data");
      })
      .catch(err => {
        console.log(err);
      });
      
    console.log(data);
  };

  buttonHandle = i =>
    this.state.detailEdit[i].editStatus ? (
      <div className="ui basic icon buttons">
        <button
          className="ui  button"
          style={{ margin: "5px" }}
          onClick={() => {
            let ups = this.state.detailEdit;
            ups[i].editStatus = !ups[i].editStatus;
            ups[i].initial = this.state.studentDetails[i].roundName;
            this.setState({ detailEdit: ups });
            let data = {
              HTNO: this.state.studentDetails[i].HTNO,
              roundName: this.state.studentDetails[i].roundName
            };
            tnpbase.post("/drives/performance/editDetail", data);
            console.log(this.state.detailEdit);
          }}
        >
          <i className="check icon" />
        </button>
        <button
          className="ui  button"
          onClick={() => {
            this.state.detailEdit[i].editStatus = !this.state.detailEdit[i].editStatus;
            console.log(this.state.detailEdit);
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
            this.state.detailEdit[i].editStatus = !this.state.detailEdit[i].editStatus;
            // console.log(this.state.detailEdit[i].editStatus)
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
        <h2>testing</h2>
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
              onChange={dateDetail => this.setState({ date: dateDetail })}
            />
          </form>
          <br />
        </div>
        <div>
          <br />
          <button className="ui button">
            <i className="check icon" onClick={this.enableTable} />
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

const mapStateToProps = state => {
  return {
    perfData: state.perfData
  };
};

export default connect(
  mapStateToProps,
  { FetchPerfData }
)(Page);
