import React from "react";
import { connect } from "react-redux";
import tnpbase from "../../api/tnpbase";
import DriveViewForm from "./DriveViewForm";
import {
  fetchDrives,
  setEditDriveAction,
  setAddRoundAction
} from "../../actions";

class DriveView extends React.Component {
  deleteRound = (drive_id, round_id, noOfRounds, driveYear) => {
    const data = { drive_id, round_id, noOfRounds };
    tnpbase
      .post("/drives/rounds/delete", { data })
      .then(res => {
        if (res.status === 200) {
          this.props.fetchDrives(driveYear);
        } else {
          window.alert(`Error: ${res.data.status} \n ${res.data.error}`);
        }
      })
      .catch(err => window.alert(`Error: ${err.message}`));
  };

  deleteDrive = (drive, driveYear) => {
    tnpbase
      .post("/drives/delete", { data: drive })
      .then(res => {
        if (res.status === 200) {
          this.props.fetchDrives(driveYear);
        } else {
          window.alert(`Error: ${res.data.status} \n ${res.data.error}`);
        }
      })
      .catch(err => window.alert(`Error: ${err.message}`));
  };

  submitData = (formValues, drive_id, year) => {
    const roundIds = [];
    const reqKeys = Object.keys(formValues).filter(key =>
      key.startsWith("round")
    );
    for (let i = 0; i < reqKeys.length; i++) {
      roundIds.push(parseInt(formValues[reqKeys[i]]));
    }
    if (formValues.newRound) {
      roundIds.push(parseInt(formValues.newRound));
    }
    const data = {
      date: formValues.date.toLocaleDateString("en-GB"),
      roundIds,
      drive_id
    };
    tnpbase
      .post("/drives/modify", { data })
      .then((res) => {
        if (res.status === 200) {
          this.props.fetchDrives(year);
          this.props.setAddRoundAction(-1);
          this.props.setEditDriveAction(-1);
        } else {
          window.alert(`Error: ${res.data.status} \n ${res.data.error}`);
        }
      })
      .catch(err => window.alert(`Error: ${err.message}`));
  };
  render() {
    return (
      <div>
        <DriveViewForm
          deleteRound={this.deleteRound}
          submitData={this.submitData}
          deleteDrive={this.deleteDrive}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    rounds: state.roundsList
  };
};

export default connect(
  mapStateToProps,
  { fetchDrives, setAddRoundAction, setEditDriveAction }
)(DriveView);
