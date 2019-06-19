import React from "react";
import DatePicker from "react-datepicker";
import converter from "number-to-words";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import tnpbase from "../api/tnpbase";

class AddDrive extends React.Component {
  state = {
    companyName: "",
    date: new Date(),
    noOfRounds: 4,
    onCampus: true,
    remarks: "",
    selectedRounds: {
      round1: "",
      round2: "",
      round3: "",
      round4: "",
      round5: "",
      round6: "",
      round7: "",
      round8: ""
    }
  };

  submitForm = e => {
    e.preventDefault();
    const roundNames = [];
    for (let i = 0; i < this.state.noOfRounds; i++) {
      roundNames.push(this.state.selectedRounds[`round${i + 1}`]);
    }
    const data = {
      companyName: this.state.companyName,
      date: this.state.date.toLocaleDateString(),
      noOfRounds: this.state.noOfRounds,
      type: this.state.onCampus ? "ON Campus" : "OFF Campus",
      remarks: this.state.remarks,
      selectedRounds: roundNames
    };
    tnpbase
      .post("/drives/add", { data })
      .then(() => console.log("data submitted"))
      .catch(err => console.log(err));
  };

  displaySelectRounds = () => {
    let tempArray = [];
    for (let i = 0; i < this.state.noOfRounds; i++) {
      tempArray.push(i);
    }
    return tempArray.map((num, i) => {
      return (
        <div className="required field" key={i}>
          <label>{`Round ${num + 1}`}</label>
          <select
            className="ui dropdown fluid"
            placeholder="Select Round"
            value={this.state.selectedRounds[`round${i + 1}`]}
            onChange={e => {
              let temp = this.state.selectedRounds;
              temp[`round${i + 1}`] = e.target.value;
              this.setState({ selectedRounds: temp });
            }}
          >
            <option value="">Select Round</option>
            {this.props.rounds.map((round, i) => {
              return (
                <option value={round.id} key={i}>
                  {round.name}
                </option>
              );
            })}
          </select>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="ui container">
        <form className="ui form">
          <h2 className="ui dividing header">Add Drive</h2>
          <div className="required field">
            <label>Company Name</label>
            <div className="ui left icon input">
              <input
                type="text"
                placeholder="Company Name"
                value={this.state.companyName}
                onChange={e =>
                  this.setState({ companyName: e.target.value.toUpperCase() })
                }
              />
              <i className="briefcase icon" />
            </div>
          </div>
          <div className="required field">
            <label>
              <i className="calendar alternate outline icon" />
              Drive Date
            </label>
            <DatePicker
              onChange={date => this.setState({ date: date })}
              dateFormat="dd/MM/yyyy"
              selected={this.state.date}
            />
          </div>
          <div className="required field">
            <label>No. of rounds</label>
            <div className="ui left icon input">
              <input
                type="number"
                value={this.state.noOfRounds}
                min={2}
                max={8}
                onChange={e => this.setState({ noOfRounds: e.target.value })}
              />
              <i className="spinner icon" />
            </div>
          </div>
          <h4 className="ui dividing header">Select Rounds</h4>
          <div
            className={`${
              // @ts-ignore
              this.state.noOfRounds === ""
                ? ""
                : converter.toWords(this.state.noOfRounds)
            } wide fields`}
          >
            {this.displaySelectRounds()}
          </div>
          <div className="ui segment">
            <div className="field">
              <div
                className="ui toggle checkbox"
                onClick={() =>
                  this.setState({ onCampus: !this.state.onCampus })
                }
              >
                <input
                  type="checkbox"
                  tabIndex={0}
                  className="hidden"
                  checked={this.state.onCampus}
                  onChange={() => {}}
                />
                <label>
                  {this.state.onCampus ? "ON Campus" : "OFF Campus"}
                </label>
              </div>
            </div>
          </div>
          <div className="field">
            <label>Remarks</label>
            <div className="ui left icon input">
              <input
                type="text"
                placeholder="Remarks"
                value={this.state.remarks}
                onChange={e => this.setState({ remarks: e.target.value })}
              />
              <i className="exclamation icon" />
            </div>
          </div>
          <button
            className="large blue ui labeled icon button"
            onClick={this.submitForm}
          >
            <i className="paper plane icon" />
            Submit
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    rounds: state.roundsList
  };
};

export default connect(mapStateToProps)(AddDrive);
