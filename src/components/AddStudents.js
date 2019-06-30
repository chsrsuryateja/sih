import React from "react";
import FileUpload from "./FileUpload";
import { connect } from "react-redux";
import { removeFile } from "../actions/";
import SuccessMessage from "./ui_utils/SuccessMessage";
import ErrorDisplay from "./ui_utils/ErrorDisplay";

const showSelectedFiles = props => {
  return props.files.map((file, i) => {
    return (
      <div className="item" key={i}>
        <div className="right floated content">
          <button
            className="ui button secondary"
            onClick={() => props.removeFile(file, props.inputRef)}
          >
            Remove
          </button>
        </div>
        <i className="file icon" />
        <div className="content">{file.name}</div>
      </div>
    );
  });
};

const displayStatus = props => {
  if (props.submitted) {
    if (props.loading) {
      return <h1>Loading</h1>;
    } else if (props.error !== "") {
      return (
        <ErrorDisplay
          headerData={props.error}
          message={props.message}
          showTry={false}
          handleXClick={props.handleXClick}
        />
      );
    } else {
      return (
        <SuccessMessage
          message={props.message}
          handleXClick={props.handleXClick}
        />
      );
    }
  }
};

const AddStudents = props => {
  return (
    <div>
      <h2 className="ui center aligned icon header" id="student-header">
        <i className="circular users icon" />
        Import Student DB
      </h2>
      <div className="ui centered grid">
        <div className="eight wide centered column">
          <FileUpload />
        </div>
        <div className="eight wide column">
          <div style={{ overflowY: "scroll", height: "19em" }}>
            <h3 className="ui header">Selected File(s):</h3>
            <div className="ui middle aligned divided list">
              <p style={{ textAlign: "center" }}>
                {props.files.length === 0
                  ? "Please select files to upload"
                  : ""}
              </p>
              {showSelectedFiles(props)}
            </div>
          </div>
          <br />
          <p>
            Total number of files selected: <b>{props.files.length}</b>
          </p>
          <button
            className="ui blue labeled icon right floated  button"
            onClick={() => props.handleUpload(props.files)}
          >
            <i className="upload icon" />
            Upload
          </button>
          <div style={{ marginTop: "55px" }}>{displayStatus(props)}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    files: state.selectedFiles,
    inputRef: state.inputRef
  };
};

export default connect(
  mapStateToProps,
  { removeFile }
)(AddStudents);
