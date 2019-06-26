import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { DatePickerNew, Select, ActionSelect } from "../ui_utils/";
import {
  fetchDrives,
  setAddRoundAction,
  setEditDriveAction,
  setDefaultDate,
  setDefaultRounds
} from "../../actions/";

const displayRoundDropDown = props => {
  return (
    <form className="ui form">
      <Field
        name="newRound"
        style={{ padding: "1px", width: "110px" }}
        component={Select}
      >
        <option value="">Select Round</option>
        {props.rounds.map((round, i) => {
          return (
            <option key={i} value={round.id}>
              {round.round_name}
            </option>
          );
        })}
      </Field>
    </form>
  );
};

const displayDate = (props, driveIndex, driveDate) => {
  return (
    <td>
      {props.editable === driveIndex + 1 ? (
        <form className="ui form">
          <Field
            component={DatePickerNew}
            name="date"
            label="Drive Date"
            required
            iconName="calendar alternate outline"
          />
        </form>
      ) : (
        new Date(driveDate).toDateString()
      )}
    </td>
  );
};

const displayDriveRounds = (props, driveIndex, drive) => {
  return (
    <td>
      {props.editable === driveIndex + 1 ? (
        <ol className="ui list">
          {drive.rounds.map((drive_round, driveRoundIndex) => {
            return (
              <li key={driveRoundIndex}>
                <Field
                  name={`rounds${driveRoundIndex + 1}`}
                  component={Select}
                  className="ui dropdown"
                  style={{ padding: "2px", height: "25px" }}
                >
                  {props.rounds.map((round, roundIndex) => {
                    return (
                      <option key={roundIndex} value={round.id}>
                        {round.round_name}
                      </option>
                    );
                  })}
                </Field>
              </li>
            );
          })}
        </ol>
      ) : (
        <ol className="ui list">
          {drive.rounds.map((round, driveRoundIndex) => {
            return (
              <li key={driveRoundIndex}>
                {round.round_name}
                <button
                  className="mini ui right floated icon button"
                  style={{ padding: 2.5,  display: props.driveYear==="upcoming" ? "" : "none" }}
                  onClick={() => {
                    props.deleteRound(
                      drive.drive_id,
                      round.id,
                      drive.rounds.length,
                      props.driveYear
                    );
                  }}
                >
                  <i className="trash icon" />
                </button>
              </li>
            );
          })}
          <li
            style={{
              display: props.showAddRound === driveIndex + 1 ? "" : "none"
            }}
          >
            {displayRoundDropDown(props)}
          </li>
        </ol>
      )}
    </td>
  );
};

const displayButtons = (props, driveIndex, drive) => {
  return (
    <td style={{ display: props.driveYear === "upcoming" ? "" : "none" }}>
      {props.showAddRound === driveIndex + 1 ||
      props.editable === driveIndex + 1 ? (
        <div className="ui basic icon buttons">
          <button
            className="ui button"
            onClick={props.handleSubmit(formValues =>
              props.submitData(formValues, drive.drive_id, props.driveYear)
            )}
          >
            <i className="check icon" />
          </button>
          <button
            className="ui button"
            onClick={() => {
              props.reset();
              props.setAddRoundAction(-1);
              props.setEditDriveAction(-1);
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
              props.setDefaultDate(new Date(drive.date_of_drive));
              props.setDefaultRounds(drive.rounds);
              props.setAddRoundAction(driveIndex + 1);
            }}
          >
            <i className="add icon" />
          </button>
          <button
            className="ui button"
            onClick={() => {
              props.setDefaultDate(new Date(drive.date_of_drive));
              props.setDefaultRounds(drive.rounds)
              props.setEditDriveAction(driveIndex + 1);
            }}
          >
            <i className="edit icon" />
          </button>
          <button
            className="ui button"
            onClick={() => {
              props.deleteDrive(drive, props.driveYear);
            }}
          >
            <i className="trash icon" />
          </button>
        </div>
      )}
    </td>
  );
};

const displayDrives = props => {
  if (props.drives.length === 0) {
    return (
      <tr>
        <td colSpan={8} style={{textAlign: "center"}}><b>It's Lonely Here</b></td>
      </tr>
    );
  }
  return props.drives.map((drive, driveIndex) => {
    return (
      <tr key={driveIndex}>
        <td>{driveIndex + 1}</td>
        <td>{drive.company}</td>
        {displayDate(props, driveIndex, drive.date_of_drive)}
        <td>{drive.no_of_rounds}</td>
        {displayDriveRounds(props, driveIndex, drive)}
        <td>{drive.type_of_drive}</td>
        <td>{drive.remarks}</td>
        {displayButtons(props, driveIndex, drive)}
      </tr>
    );
  });
};

const DriveViewForm = props => { 
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
        <Field
          name="driveYear"
          iconName="calender alternate icon"
          required
          component={ActionSelect}
          buttonText="Get Drives"
          label="Select year"
          onButtonClick={props.fetchDrives}
        >
          <option value="upcoming">Upcoming drives</option>
          {props.years.map((year, i) => {
            return (
              <option key={i} value={year.passing_out_year}>
                {year.passing_out_year}
              </option>
            );
          })}
        </Field>
      </div>
      <br />
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
            <th style={{ display: props.driveYear==="upcoming" ? "" : "none" }}>Action</th>
          </tr>
        </thead>
        <tbody>{displayDrives(props)}</tbody>
      </table>
    </div>
  );
};

const mapStateToProps = state => {
  const defRounds ={};
  for(let i = 0; i<state.defaultRounds.length; i++) {
    defRounds[`rounds${i+1}`] = state.defaultRounds[i].id;
  }
  return {
    rounds: state.roundsList,
    showAddRound: state.setAddRound,
    editable: state.setEditDrive,
    years: state.driveYears,
    drives: state.drives,
    driveYear: formValueSelector("driveViewForm")(state, "driveYear"),
    initialValues: {
      driveYear: "upcoming",
      date: state.defaultDate,
       ...defRounds
    }
  };
};

export default connect(
  mapStateToProps,
  { fetchDrives, setAddRoundAction, setEditDriveAction, setDefaultDate, setDefaultRounds }
)(
  reduxForm({
    form: "driveViewForm",
    enableReinitialize: true
  })(DriveViewForm)
);
