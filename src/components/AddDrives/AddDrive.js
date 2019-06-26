import React from "react";
import AddDriveForm from "./AddDriveForm";
import "react-datepicker/dist/react-datepicker.css";
import tnpbase from "../../api/tnpbase";

class AddDrive extends React.Component {
  state = { loading: false, error: "", message: "", submitted: false };

  handleXClick = () => {
    this.setState({ submitted: false });
  };

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
      .then(res => {
        this.setState({submitted: true, loading: true})
        if (res.status === 200) {
          this.setState({
            loading: false,
            message: res.data.status,
            error: ""
          });
        } else {
          this.setState({
            loading: false,
            error: res.data.status,
            message: res.data.error
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false,
          error: "Unable to add drive",
          message: err.message
        });
      });
  };

  render() {
    return (
      <div className="ui container">
        <AddDriveForm
          mySubmitForm={this.submitForm}
          myMessage={this.state.message}
          myError={this.state.error}
          myLoading={this.state.loading}
          mySubmitted={this.state.submitted}
          handleXClick={this.handleXClick}
        />
      </div>
    );
  }
}

export default AddDrive;
