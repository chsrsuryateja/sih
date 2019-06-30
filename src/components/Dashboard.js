import React from "react";
import tnpbase from "../api/tnpbase";

class Dashboard extends React.Component {
  state = { drives: []}
  componentDidMount = () => {
    tnpbase.get("/drives/upcoming").then(res => {
      this.setState({drives: res.data.result})
    }).catch(err => {
      console.log(err);
    })
  }

  showNoDrives = () => {
    if(this.state.drives.length === 0) {
      return(
        <tr>
          <td colSpan={7} style={{textAlign: "center"}} >
            No upcoming drives
          </td>
        </tr>
      );
    }
  }
  render() {
    return (
      <div className="ui container">
        <h2 style={{textAlign: "center"}}>Upcoming Drives</h2>
        <table className="ui blue celled striped compact table">
        <thead>
          <tr>
            <th>SNo.</th>
            <th>Company</th>
            <th>Date</th>
            <th>#Rounds</th>
            <th>Rounds</th>
            <th>Type</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
         {this.showNoDrives()}
          {this.state.drives.map((drive, driveIndex) => {
            return(
              <tr key={driveIndex}>
                <td>{driveIndex+1}</td>
                <td>{drive.company}</td>
                <td>{new Date(drive.date_of_drive).toDateString()}</td>
                <td>{drive.no_of_rounds}</td>
                <td>
                <ol className="ui list">
          {drive.rounds.map((round, driveRoundIndex) => {
            return (
              <li key={driveRoundIndex}>
                {round.round_name}
              </li>
            );
          })}
        </ol>
                </td>
                <td>{drive.type_of_drive}</td>
                <td>{drive.remarks}</td>
              </tr>
            );
          })}
        </tbody>
          </table>
      </div>
    );
  }
};

export default Dashboard;
