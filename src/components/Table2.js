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
          rounds: response.data[1]
        });
      })
      .catch(err => console.log(err));
  };

  enableTable = () => {
    let data = { driveName: this.state.driveName, date: new Date(this.state.date).toLocaleDateString("en-GB") };
    tnpbase
      .post("/drives/performance/driveDetails", data)
      .then((response) => {
        const status = [];
        console.log("Fetching Data");
        for (let i = 0; i < response.data.length; i++) {
          status.push({
            editStatus: false,
            initial: response.data[i][1]
          });
        }
        this.setState({detailEdit : status, studentDetails : response.data});
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
            // let data = {
            //   HTNO: this.state.studentDetails[i][0],
            //   roundName: this.state.studentDetails[i][1]
            // };
            let data = [this.state.studentDetails[i][0],this.state.studentDetails[i][1]]
            tnpbase
            .post("/drives/performance/editDetail", data)
            .then((response)=>{
              let ups = this.state.detailEdit;
              ups[i].editStatus = !ups[i].editStatus;
              this.setState({detailEdit : ups , studentDetails : response.data});
            })
            .catch((err)=>{
              console.log(err)
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
            this.state.studentDetails[i][1] = ups[i].initial;
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
          }}
        >
          <i className="pencil alternate icon" />
          Edit
        </button>
      </div>
    );

  tableData = () => {
    if(this.state.studentDetails.length === 0) {
      return (
        <tr>
          <td colSpan={3}>It's Lonely Here</td>
        </tr>
      );
    }
    return this.state.studentDetails.map((number, i) => {
      return (
        <tr key={i}>
          <td>{number[0]}</td>
          <td>
            {this.state.detailEdit[i].editStatus ? (
              <select
                className="ui search dropdown"
                defaultValue={number[1]}
                onChange={e => {
                  console.log("Selected val, directly" + e.target.value);
                  number[1] = e.target.value;
                }}
              >
                {this.state.rounds.map(round => (
                  <option value={round}>{round}</option>
                ))}
              </select>
            ) : (
              number[1]
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
        <h2>testing page</h2>
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
                this.setState({ date: dateDetail })}}
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
