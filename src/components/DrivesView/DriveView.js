import React from "react";
import { connect } from "react-redux";
import tnpbase from "../../api/tnpbase";
import DriveViewForm from "./DriveViewForm"

const deleteRound = (drive_id, round_id, noOfRounds) => {
  const data = { drive_id, round_id, noOfRounds };
  console.log(data);
  tnpbase
    .post("/drives/rounds/delete", { data })
    .then(() => {
      this.fetchUpcomingDrives();
    })
    .catch(err => console.log(err));
};

const deleteDrive = drive => {
  tnpbase
    .post("/drives/delete", { data: drive })
    .then(() => {
      console.log("In delete");
      this.fetchUpcomingDrives();
    })
    .catch(err => console.log(err));
};

const submitData = drive_id => {
  if (this.state.newRound !== "") {
    const final_rounds = this.state.rounds;
    final_rounds.push(this.state.newRound);
    this.setState({ rounds: final_rounds });
  }
  const data = {
    rounds: this.state.rounds,
    date: this.state.date.toLocaleDateString("en-GB"),
    drive_id: drive_id
  };
  console.log(data);
  tnpbase
    .post("/drives/modify", { data })
    .then(() => {
      this.setState({ showTickButtons: false });
      this.fetchUpcomingDrives();
    })
    .catch(err => console.log(err));
};

const DriveView = props => {
  return(
    <div>
      <DriveViewForm
      deleteRound={deleteRound}
      submitData={submitData}
      deleteDrive={deleteDrive}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    rounds: state.roundsList
  };
};

export default connect(mapStateToProps)(DriveView);
