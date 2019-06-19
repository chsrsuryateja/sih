import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import tnpbase from "../api/tnpbase";

class DriveView extends React.Component {
  state = {
    editForm: false,
    upcomingDrivesStatus: [],
    upcomingDrives: [],
    date: null,
    rounds: [],
    showTickButtons: false,
    newRound: null
  };

  fetchUpcomingDrives = () => {
    tnpbase
      .get("/drives/upcoming")
      .then(response => {
        const status = [];
        this.setState({
          upcomingDrives: response.data,
          upcomingDrivesStatus: []
        });
        for (let i = 0; i < this.state.upcomingDrives.length; i++) {
          status.push({ editable: false, showAddRound: false });
        }
        this.setState({ upcomingDrivesStatus: status });
      })
      .catch(err => console.log(err));
  };

  deleteDrive = drive => {
    tnpbase
      .post("/drives/delete", { data: drive })
      .then(() => console.log("" + drive + " is deleted"))
      .catch(err => console.log(err));
  };

  submitData = () => {
    if (this.state.newRound !== null) {
      this.setState({ rounds: [...this.state.rounds, this.state.newRound] });
    }

    const data = { rounds: this.state.rounds, date: this.state.date };
    console.log(data)
    tnpbase
      .post("/drives/modify", { data })
      .then(() => {this.setState({ showTickButtons: false }); this.fetchUpcomingDrives()})
      .catch(err => console.log(err));

    console.log("submit Clicked", this.state);
  };

  componentDidMount = () => {
    this.fetchUpcomingDrives();
  };

  displayDrives = () => {
    if (this.state.upcomingDrivesStatus.length === 0) {
      return (
        <tr>
          <td colSpan={5}>It's Lonely Here</td>
        </tr>
      );
    }
    return this.state.upcomingDrives.map((drive, i) => {
      return (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{drive.company}</td>
          <td>
            {this.state.upcomingDrivesStatus[i].editable ? (
              <form className="ui form">
                <DatePicker
                  selected={this.state.date}
                  onChange={date => this.setState({ date: date })}
                  dateFormat="dd/MM/yyyy"
                />
              </form>
            ) : (
              new Date(drive.date_of_drive).toDateString()
            )}
          </td>
          <td>{drive.no_of_rounds}</td>
          <td>
            {this.state.upcomingDrivesStatus[i].editable ? (
              <ol className="ui list">
                {drive.rounds.map((drive_round, j) => {
                  return (
                    <li key={j}>
                      <select
                        className="ui dropdown"
                        value={this.state.rounds[j]}
                        style={{ padding: "2px", height: "25px" }}
                        onChange={e => {
                          let rounds = this.state.rounds;
                          rounds[j] = parseInt(e.target.value);
                          this.setState({ rounds: rounds });
                        }}
                      >
                        {this.props.rounds.map((round, i) => {
                          return (
                            <option value={round.id}>{round.round_name}</option>
                          );
                        })}
                      </select>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <ol className="ui list">
                {drive.rounds.map((round, i) => {
                  return <li key={i}>{round.round_name}</li>;
                })}
                <li
                  style={{
                    display: this.state.upcomingDrivesStatus[i].showAddRound
                      ? ""
                      : "none"
                  }}
                >
                  <form className="ui form">
                    <select
                      style={{ padding: "1px", width: "110px" }}
                      value={this.state.newRound}
                      onChange={e =>
                        this.setState({ newRound: parseInt(e.target.value) })
                      }
                    >
                      <option value="">Select Round</option>
                      {this.props.rounds.map((round, i) => {
                        return (
                          <option key={i} value={round.id}>
                            {round.round_name}
                          </option>
                        );
                      })}
                    </select>
                  </form>
                </li>
              </ol>
            )}
          </td>
          <td>{drive.type_of_drive}</td>
          <td>{drive.remarks}</td>
          <td>
            {this.state.showTickButtons ? (
              <div className="ui basic icon buttons">
                <button className="ui button" onClick={() => this.submitData()}>
                  <i className="check icon" />
                </button>
                <button
                  className="ui button"
                  onClick={() => {
                    let ups = this.state.upcomingDrivesStatus;
                    ups[i].showAddRound = false;
                    ups[i].editable = false;
                    this.setState({
                      upcomingDrivesStatus: ups,
                      showTickButtons: false
                    });
                  }}
                >
                  <i className="x icon" />
                </button>
              </div>
            ) : (
              <div className="ui basic icon buttons">
                <button
                  className=" ui button"
                  onClick={() => {
                    let ups = this.state.upcomingDrivesStatus;
                    ups[i].showAddRound = !ups[i].showAddRound;
                    let rounds = [];
                    for (let temp = 0; temp < drive.rounds.length; temp++) {
                      rounds.push(drive.rounds[temp].id);
                    }
                    this.setState({
                      upcomingDrivesStatus: ups,
                      date: new Date(drive.date_of_drive),
                      showTickButtons: true,
                      rounds: rounds
                    });
                  }}
                >
                  <i className="add icon" />
                </button>
                <button
                  className="ui button"
                  onClick={() => {
                    let ups = this.state.upcomingDrivesStatus;
                    ups[i].editable = !ups[i].editable;
                    let rounds = [];
                    for (let temp = 0; temp < drive.rounds.length; temp++) {
                      rounds.push(drive.rounds[temp].id);
                    }
                    this.setState({
                      upcomingDrivesStatus: ups,
                      date: new Date(drive.date_of_drive),
                      showTickButtons: true,
                      rounds: rounds
                    });
                  }}
                >
                  <i className="edit icon" />
                </button>
                <button
                  className="ui button"
                  onClick={() => this.deleteDrive(drive)}
                >
                  <i className="trash icon" />
                </button>
              </div>
            )}
          </td>
        </tr>
      );
    });
  };
  render() {
    return (
      <div className="ui container">
        <h3 className="ui center aligned icon header">
          <i className="chart bar icon" />
          <div className="content">
            View Drive
            <div className="sub header">Manage Drives</div>
          </div>
        </h3>
        <div className="ui form">
          <div className="required field">
            <label>
              <i className="calendar alternate outline icon" />
              Drive Date
            </label>
            <div className="ui fluid action input">
              <select>
                <option>Upcoming drives</option>
                <option>Completed drives - Current Year</option>
                <option>2018</option>
              </select>
              <button className="ui secondary button">Get Drives</button>
            </div>
          </div>
        </div>
        <br />
        <table className="ui blue celled striped table">
          <thead>
            <tr>
              <th>SNo.</th>
              <th>Company</th>
              <th>Date</th>
              <th>#Rounds</th>
              <th>Rounds</th>
              <th>Type</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.displayDrives()}</tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    rounds: state.roundsList
  };
};

export default connect(mapStateToProps)(DriveView);
