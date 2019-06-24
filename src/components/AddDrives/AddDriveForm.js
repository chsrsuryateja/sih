import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { IconInput, DatePickerNew, CheckBox, Select } from "../ui_utils/";

const displaySelectRounds = props => {
  let tempArray = [];
  for (let i = 0; i < props.noOfRounds; i++) {
    tempArray.push(i);
  }
  return tempArray.map((num, i) => {
    return (
      <Field
        name={`round${num + 1}`}
        required
        label={`Round ${num + 1}`}
        component={Select}
        key={i}
      >
        <option value="" key={i}>
          Select Round
        </option>
        {props.rounds.map((round, j) => {
          return (
            <option value={round.id} key={j}>
              {round.round_name}
            </option>
          );
        })}
      </Field>
    );
  });
};

const AddDriveForm = props => {
  return (
    <form className="ui form" onSubmit={props.handleSubmit(props.mySubmitForm)}>
      <h2 className="ui dividing header">Add Drive</h2>
      <Field
        component={IconInput}
        type="text"
        placeholder="Name"
        name="companyName"
        label="Company Name"
        required
        iconName="briefcase"
        normalize={value => value.toUpperCase()}
      />
      <Field
        component={DatePickerNew}
        name="date"
        label="Drive Date"
        required
        iconName="calendar alternate outline"
        normalize={value => new Date(value)}
      />
      <Field
        component={IconInput}
        type="number"
        placeholder="No. of Rounds"
        name="noOfRounds"
        label="No. of Rounds (between 2 and 8)"
        required
        iconName="spinner"
        customProps={{ min: 2, max: 8 }}
      />
      <h4 className="ui dividing header">Select Rounds</h4>
      <div className="two fields">{displaySelectRounds(props)}</div>
      <Field name="onCampus" component={CheckBox} />
      <Field
        type="text"
        placeholder="Remarks"
        name="remarks"
        label="Remarks"
        iconName="exclamation"
        component={IconInput}
      />
      <button
        className={`large blue ui labeled icon button ${
          props.valid ? "" : "disabled"
        }`}
        type="submit"
      >
        <i className="paper plane icon" />
        Submit
      </button>
    </form>
  );
};

const mapStateToProps = state => {
  return {
    noOfRounds: formValueSelector("addDriveForm")(state, "noOfRounds"),
    rounds: state.roundsList
  };
};

const validate = formValues => {
  const errors = {};
  if (!formValues.companyName) {
    errors.companyName = "Please enter a name";
  }

  if (!formValues.noOfRounds) {
    errors.noOfRounds = "Enter number of rounds (2 to 8)";
  }

  for (let i = 0; i < formValues.noOfRounds; i++) {
    if (!formValues[`round${i + 1}`]) {
      errors[`round${i + 1}`] = "Select a round";
    }
  }

  return errors;
};

export default connect(mapStateToProps)(
  reduxForm({
    form: "addDriveForm",
    // @ts-ignore
    validate: validate,
    initialValues: {
      noOfRounds: 4,
      date: new Date(),
      onCampus: true,
      remarks: ""
    }
  })(AddDriveForm)
);
