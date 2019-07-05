import React from "react";
import tnpbase from "../api/tnpbase";
import { connect } from "react-redux";
import {
  ActionInput,
  Select,
  SelectActionInput,
  Input,
  ModifiedMultiSelect
} from "./ui_utils";

import ErrorDisplay from "./ui_utils/ErrorDisplay";
import { fetchDrives } from "../actions/";
import { Field, reduxForm, formValueSelector } from "redux-form";
import SuccessMessage from "./ui_utils/SuccessMessage";
import MultiSelect from "./Multiselect/MultiSelect";

const data = [
  {
    name: "CSE",
    value: "5"
  },
  {
    name: "IT",
    value: "12"
  },
  {
    name: "ECE",
    value: "4"
  },
  {
    name: "EEE",
    value: "2"
  },
  {
    name: "CIVIL",
    value: "1"
  },
  {
    name: "MECH",
    value: "3"
  }
];

class FilterStudents extends React.Component {
  state = {
    driveToAdd: "",
    filteredStudents: [],
    loading: false,
    error: "",
    message: "",
    additionalMsg: "",
    submitted: false,
    addToDriveClicked: false,
    specialDrives: [],
    selectedCompanies: []
  };

  componentDidMount= () => {
    this.props.fetchDrives("upcoming");
    this.getSpecialDrives();
  };


  getSpecialDrives = () => {
    tnpbase
      .get("/drives/special")
      .then(res => {
        // console.log(res.data.result)
        this.setState({ specialDrives: res.data.result });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleXClick = () => {
    this.setState({ submitted: false });
  };

  handleXClickFilter = () => {
    this.setState({ addToDriveClicked: false });
  };

  displayStatus = () => {
    if (this.state.submitted) {
      if (this.state.loading) {
        return (
          <h3 style={{ textAlign: "center", color: "b#4ba5d8ue" }}>
            ...Loading...
          </h3>
        );
      } else if (this.state.error !== "") {
        return (
          <ErrorDisplay
            headerData={this.state.error}
            message={this.state.message}
            showTry={false}
            handleXClick={this.handleXClick}
          />
        );
      }
    }
  };

  displayFilterStatus = () => {
    if (this.state.addToDriveClicked) {
      if (this.state.loading) {
        return (
          <h3 style={{ textAlign: "center", color: "b#4ba5d8ue" }}>
            ...Loading...
          </h3>
        );
      } else if (this.state.error !== "") {
        return (
          <ErrorDisplay
            headerData={this.state.error}
            message={this.state.message}
            showTry={false}
            handleXClick={this.handleXClickFilter}
          />
        );
      } else {
        return (
          <SuccessMessage
            message={this.state.message}
            handleXClick={this.handleXClickFilter}
          />
        );
      }
    }
  };

  submitFilterDetails = formValues => {
    this.setState({ submitted: true, loading: true });
    const data = {
      btech_score: parseFloat(formValues.btechScore),
      btech_score_type: formValues.btechScoreType,
      branch: formValues.selectedBranches,
      backlogs: parseInt(formValues.backlogs),
      class12_score: parseFloat(formValues.class12Score),
      class12_score_type: formValues.class12ScoreType,
      class10_score: parseFloat(formValues.class10Score),
      class10_score_type: formValues.class10ScoreType,
      eamcet_rank: parseInt(formValues.eamcetRank),
      gender: formValues.gender,
      isSelected: formValues.allowSelected,
      year_of_passing: parseInt(formValues.yop),
      selectedCompanies: this.state.selectedCompanies
    };
    tnpbase
      .post("/students/filter", { data })
      .then(res => {
        if (res.status === 200) {
          if (res.data.result.length === 0) {
            this.setState({
              error: res.data.status,
              message: res.data.error,
              loading: false
            });
          } else if (res.data.result.length !== 0) {
            this.setState({
              filteredStudents: res.data.result,
              message: res.data.status,
              loading: false,
              error: ""
            });
          }
        } else {
          this.setState({
            error: res.data.status,
            message: res.data.error,
            loading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: "Unable to filter students!",
          message: err.message,
          loading: false
        });
      });
  };

  showFilteredStudents = () => {
    return this.state.filteredStudents.map((student, i) => {
      return (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{student.HTNO}</td>
          <td>{student.NAME}</td>
          <td>{student.class10_score}</td>
          <td>{student.class12_score}</td>
          <td>{student.EAMCET_RANK}</td>
          <td>{student.btech_score}</td>
          <td>{student.BTECH_BACKLOGS}</td>
          <td>{student.BRANCH_CODE}</td>
          <td>{student.GENDER}</td>
          <td>{student.YOP_BTECH}</td>
          <td>{student.selection_status}</td>
          <td>{student.PARENT_MOBILE}</td>
          <td>{student.EMAIL}</td>
        </tr>
      );
    });
  };

  addToDrive = () => {
    this.setState({ addToDriveClicked: true, loading: true });
    const data = {
      driveToAdd: this.state.driveToAdd,
      students: this.state.filteredStudents
    };
    tnpbase
      .post("/students/addToDrive", {
        data
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            message: res.data.status,
            loading: false
          });
        } else {
          this.setState({ error: res.data.status, message: res.data.error });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: "Unable to addd to drive!",
          message: err.message,
          loading: false
        });
      });
  };

  render() {
    return (
      <div className="ui container">
        <h2 className="ui header center aligned">Filter Students</h2>
        <div className="ui form">
          <div className="two fields">
            <Field
              name="btechScore"
              type="number"
              label="Btech Score"
              component={ActionInput}
              placeholder="Btech Score"
            >
              <Field
                name="btechScoreType"
                component={SelectActionInput}
                className="menu"
                style={{ width: "100px" }}
              >
                <option className="item" value="cgpa">
                  CGPA
                </option>
                <option className="item" value="percentage">
                  Percentage
                </option>
              </Field>
            </Field>
            <Field
              label="Backlogs"
              name="backlogs"
              type="number"
              placeholder="Backlogs"
              component={Input}
            />
          </div>
          <div className="three fields">
            <Field
              name="class12Score"
              type="number"
              label="Class 12 Score"
              component={ActionInput}
              placeholder="Class 12 Score"
            >
              <Field
                name="class12ScoreType"
                component={SelectActionInput}
                className="menu"
                style={{ width: "100px" }}
              >
                <option className="item" value="cgpa">
                  CGPA
                </option>
                <option className="item" value="percentage">
                  Percentage
                </option>
              </Field>
            </Field>
            <Field
              name="class10Score"
              type="number"
              label="Class 10 Score"
              component={ActionInput}
              placeholder="Class 10 Score"
            >
              <Field
                name="class10ScoreType"
                component={SelectActionInput}
                className="menu"
                style={{ width: "100px" }}
              >
                <option className="item" value="cgpa">
                  CGPA
                </option>
                <option className="item" value="percentage">
                  Percentage
                </option>
              </Field>
            </Field>

            <Field
              label="Eamcet Rank"
              name="eamcetRank"
              type="number"
              placeholder="Eamcet Rank"
              component={Input}
            />
          </div>
          <div className="three fields">
            <Field name="gender" component={Select} label="Gender">
              <option value="all">All</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </Field>
            <Field
              label="Year of Passing"
              name="yop"
              type="number"
              placeholder="YOP"
              required
              component={Input}
            />
            <Field
              name="allowSelected"
              component={Select}
              label="Allow Selected Students?"
            >
              <option value="yes">Yes</option>
              <option value="no">NO</option>
            </Field>
          </div>
          <div className="two fields">
            <Field
              name="selectedBranches"
              component={ModifiedMultiSelect}
              data={data}
              label="Branch"
              placeholder="Select Branches"
            />
            <div className="field" style={{display: this.props.allowSelected==="yes" ? "" : "none"}}>
              <label>Select Companies</label>
            <MultiSelect options={this.state.specialDrives} onSelectOptions = {(e) => this.setState({selectedCompanies: e})} placeholder="Select Companies"/>
            </div>
            
          </div>
          <div className="field" style={{ marginTop: "10px" }}>
            {this.displayStatus()}
          </div>
          <button
            className={`ui secondary button ${
              this.props.valid ? "" : "disabled"
            }`}
            onClick={this.props.handleSubmit(this.submitFilterDetails)}
          >
            Filter
          </button>
        </div>
        <table className="ui blue celled structured striped compact table">
          <thead style={{ textAlign: "center" }}>
            <tr>
              <th rowSpan={2}>SNO</th>
              <th rowSpan={2}>Roll no.</th>
              <th rowSpan={2}>Student Name</th>
              <th colSpan={4}>Scores</th>
              <th rowSpan={2}>Backlogs</th>
              <th rowSpan={2}>Branch</th>
              <th rowSpan={2}>Gender</th>
              <th rowSpan={2}>YOP</th>
              <th rowSpan={2}>
                Already <br /> Selected?
              </th>
              <th rowSpan={2}>Phone No.</th>
              <th rowSpan={2}>Email</th>
            </tr>
            <tr>
              <th>Class 10</th>
              <th>Class 12</th>
              <th>Eamcet Rank</th>
              <th>Btech(L)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.filteredStudents.length === 0 ? (
              <tr style={{ textAlign: "center" }}>
                <td colSpan={14}>
                  <b>It's Lonely here!</b>
                </td>
              </tr>
            ) : (
              this.showFilteredStudents()
            )}
          </tbody>
          <tfoot
            className="full-width"
            style={{
              display: this.state.filteredStudents.length === 0 ? "none" : ""
            }}
          >
            <tr>
              <th colSpan={7}>
                <form className="ui form">
                  <div className="field">
                    <label>Select Drive</label>
                    <select
                      className="ui dropdown"
                      value={this.state.driveToAdd}
                      onChange={e =>
                        this.setState({ driveToAdd: e.target.value })
                      }
                    >
                      <option value="">Select Drive</option>
                      {this.props.allDrives.map((drive, someKey) => {
                        return (
                          <option value={drive.drive_id} key={someKey}>
                            {drive.company} -{" "}
                            {new Date(drive.date_of_drive).toLocaleDateString(
                              "en-GB"
                            )}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </form>
              </th>
              <th colSpan={7}>
                <button
                  className={`ui small primary labeled icon button ${
                    this.state.driveToAdd === "" ? "disabled" : ""
                  }`}
                  onClick={this.addToDrive}
                  style={{ margin: "0 auto", display: "block" }}
                >
                  <i className="user icon" /> Add to Drive
                </button>
                {this.displayFilterStatus()}
              </th>
            </tr>
          </tfoot>
        </table>
        <br />
        <br />
      </div>
    );
  }
}

const validate = formValues => {
  const errors = {};
  if (
    !(formValues.btechScore >= 5 && formValues.btechScore <= 10) &&
    formValues.btechScoreType === "cgpa"
  ) {
    errors.btechScore = "CGPA must be between 5 and 10";
  }
  if (
    !(formValues.btechScore >= 50 && formValues.btechScore <= 100) &&
    formValues.btechScoreType === "percentage"
  ) {
    errors.btechScore = "Percentage must be between 50 and 100";
  }
  if (
    !(formValues.class12Score >= 5 && formValues.class12Score <= 10) &&
    formValues.class12ScoreType === "cgpa"
  ) {
    errors.class12Score = "CGPA must be between 5 and 10";
  }
  if (
    !(formValues.class12Score >= 50 && formValues.class12Score <= 100) &&
    formValues.class12ScoreType === "percentage"
  ) {
    errors.class12Score = "Percentage must be between 50 and 100";
  }
  if (
    !(formValues.class10Score >= 5 && formValues.class10Score <= 10) &&
    formValues.class10ScoreType === "cgpa"
  ) {
    errors.class10Score = "CGPA must be between 5 and 10";
  }
  if (
    !(formValues.class10Score >= 50 && formValues.class10Score <= 100) &&
    formValues.class10ScoreType === "percentage"
  ) {
    errors.class10Score = "Percentage must be between 50 and 100";
  }
  if (!formValues.yop) {
    errors.yop = "Please enter YOP";
  }
  if (formValues.selectedBranches) {
    if (formValues.selectedBranches.length === 0) {
      errors.selectedBranches = "Please select atleast one branch";
    }
  }
  return errors;
};

const mapStateToProps = state => {
  return {
    allDrives: state.drives,
    allowSelected: formValueSelector("filterStudents")(state, "allowSelected")
  };
};

export default connect(
  mapStateToProps,
  { fetchDrives }
)(
  reduxForm({
    form: "filterStudents",
    initialValues: {
      btechScoreType: "cgpa",
      class10ScoreType: "cgpa",
      class12ScoreType: "cgpa",
      btechScore: 0,
      class10Score: 0,
      class12Score: 0,
      selectedBranches: [],
      gender: "all",
      allowSelected: "yes",
      eamcetRank: null
    },
    validate
  })(FilterStudents)
);
