import React from "react";
import AddDriveForm from "./AddDriveForm";
import "react-datepicker/dist/react-datepicker.css";
import tnpbase from "../../api/tnpbase";

class AddDrive extends React.Component {
  submitForm = formValues => {
    const roundNames = [];
    for (let i = 0; i < formValues.noOfRounds; i++) {
      roundNames.push(formValues[`round${i + 1}`]);
    }
    const data = {
      company: formValues.companyName,
      date_of_drive: formValues.date.toLocaleDateString("en-GB"),
      type_of_drive: formValues.onCampus ? "ON Campus" : "OFF Campus",
      remarks: formValues.remarks,
      no_of_rounds: formValues.noOfRounds,
      round_id: roundNames
    };

    tnpbase
      .post("/drives/add", { data })
      .then(() => console.log("data submitted"))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="ui container">
        <AddDriveForm mySubmitForm={this.submitForm} />
      </div>
    );
  }
}

export default AddDrive;
