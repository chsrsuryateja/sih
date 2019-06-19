import React from "react";
import { connect } from "react-redux";
import { FetchPerfData } from "../actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tnpbase from "../api/tnpbase";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      driveName: "",
      date: new Date(),
      showTable: false,
      detailsEdit: []
    };
    this.details = [
      { id: "17A31A0534", roundName: "Technical" },
      { id: "17A31A0545", roundName: "H.R" },
      { id: "17A31A0546", roundName: "G.D" },
      { id: "17A31A0551", roundName: "Technical" }
    ];
    this.rounds = ["Written", "Technical", "G.D", "H.R"];
    this.drive = ["T.C.S", "Cap Gemini", "Cognizant", "Open Text"];
  }

  componentDidMount = () => {
    for (let i = 0; i < this.details.length; i++) {
      this.state.detailsEdit.push({
        editStatus: false,
        initial: this.details[i].roundName
      });
    }
    console.log(this.state.detailsEdit);
  };

  enableTable = () => {
    tnpbase
      .post("")
    
    this.rounds = this.props.perfData[0];

    console.log(this.state.date + " : " + this.state.driveName);
    this.setState(prevState => ({
      showTable: !prevState.showTable
    }));
    console.log(this.state.showTable);
  };

  buttonHandle = i =>
    this.state.detailsEdit[i].editStatus ? (
      <div className="ui basic icon buttons">
        <button
          className="ui  button"
          style={{ margin: "5px" }}
          onClick={() => {
            let ups = this.state.detailsEdit;
            ups[i].editStatus = !ups[i].editStatus;
            ups[i].initial = this.details[i].roundName;
            this.setState({ detailsEdit: ups });
            console.log(this.state.detailsEdit);
          }}
        >
          <i className="check icon" />
        </button>
        <button
          className="ui  button"
          onClick={() => {
            let ups = this.state.detailsEdit;
            ups[i].editStatus = !ups[i].editStatus;
            this.details[i].roundName = ups[i].initial;
            this.setState({ detailsEdit: ups });
            console.log(this.state.detailsEdit);
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
            console.log(
              "details : " + this.state.detailsEdit[i].editStatus + "val ;" + i
            );
            let ups = this.state.detailsEdit;
            ups[i].editStatus = !ups[i].editStatus;
            this.setState({ detailsEdit: ups });
            // console.log(this.state.detailsEdit[i].editStatus)
          }}
        >
          <i className="pencil alternate icon" />
          Edit
        </button>
      </div>
    );

  tableData = () => {
    return this.details.map((number, i) => {
      return (
        <tr key={i}>
          <td>{number.id}</td>
          <td>
            {this.state.detailsEdit[i].editStatus ? (
              <select
                className="ui search dropdown"
                defaultValue={number.roundName}
                onChange={e => {
                  console.log("Selected val, directly" + e.target.value);
                  number.roundName = e.target.value;
                }}
              >
                {this.rounds.map(round => (
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

  tableDetails = () =>
    this.state.showTable ? (
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
    ) : null;

  render() {
    let drives = this.drive;
    let driveMenu = drives.map(drives => (
      <option value={drives}>{drives}</option>
    ));
    console.log(this.state.detailsEdit);
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
          <button className="ui button">
            <i className="check icon" onClick={this.enableTable} />
          </button>
        
        <br />
        <div>{this.tableDetails()}</div>
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
