import React from "react";

class DrivePerformance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      edit: false
    };
    this.rollNumbers = ["17A31A0534", "17A31A0545", "17A31A0546", "17A31A0551"];
    this.rounds = ["Written", "Technical", "G.D", "H.R"];
    this.drive = ["T.C.S", "Cap Gemini", "Cognizant", "Open Text"];
    
  }

  enableTable = () => {
    this.setState(prevState => ({
      showTable: !prevState.showTable
    }));
    console.log(this.state.showTable + ":" + this.state.edit);
  };

  buttonHandle = () =>
    this.state.edit ? (
      <div className="ui right floated basic icon buttons">
        <button
          className="ui  button"
          style={{ margin: "5px" }}
          onClick={() => this.setState({ edit: !this.state.edit })}
        >
          <i className="check icon" />
        </button>
        <button
          className="ui  button"
          onClick={() => {
            this.setState({ edit: !this.state.edit });
            console.log(this.state.edit);
          }}
        >
          <i className="x icon" />
        </button>
      </div>
    ) : (
        <div>
          <button
            className="ui right floated secondary button"
            style={{ margin: "5px" }}
            onClick={() => this.setState({ edit: !this.state.edit })}
          >
            <i className="pencil alternate icon" />
            Edit
    </button>
        </div>
      );

  roundDetail = () => {
    return this.rollNumbers.map((number) => {
      return (
        <tr key={number}>
          <td>{number}</td>
          <td>{this.rounds[3]}</td>
          <td>
            <button
              className="ui basic icon button"
              onClick={console.log("Deleted")}
            >
              <i className="trash icon" />
            </button>
          </td>
        </tr>
      )
    });
  }

  editRoundDetail = () => {
    return this.rollNumbers.map((number) => {
      return (
        <tr key={number}>
          <td>{number}</td>
          <td>
            <select className="ui search dropdown">
              {this.rounds.map(round => <option>{round}</option>)}
            </select>
          </td>
          <td>
            <button
              className="ui basic icon button"
              onClick={console.log("Deleted")}
            >
              <i className="trash icon" />
            </button>
          </td>
        </tr>
      )
    })

  }

  tableDataFormat = () =>
    this.state.edit ? (
      this.editRoundDetail()
    ) : (
        this.roundDetail()
      );



  tableDetails = () => this.state.showTable ? (
    <div className="ui container">
      {this.buttonHandle()}
      <table className="ui blue table">
        <thead>
          <tr>
            <th>Roll No.</th>
            <th>Round Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {this.tableDataFormat()}
        </tbody>
      </table>
    </div>
  ) : null;

  render() {
    let numbers = this.rollNumbers;
    let drives = this.drive;
    let rounds = this.rounds;
    let driveMenu = drives.map(drives => <option>{drives}</option>);

    let roundMenu = rounds.map(round => <option>{round}</option>);

    console.log("Initially:" + this.state.showTable);

    return (
      <div>
        <h2>Drive Performance</h2>
        <select className="ui search dropdown">{driveMenu}</select>
        <button className="ui button">
          <i className="check icon" onClick={this.enableTable} />
        </button>
        {this.tableDetails()}
      </div>
    );
  }
}

export default DrivePerformance;
