import React from "react"; 
import SuccessMessage from "./ui_utils/SuccessMessage";
import ErrorDisplay from "./ui_utils/ErrorDisplay";
import tnpbase from "../api/tnpbase";
import TestUpload from "./TestUpload";

class NewTestDisplay extends React.Component{
  state = {
    file: [],
    loading: false,
    error: "",
    message: "",
    submitted: false
  }

  selectFiles = files =>{
    this.setState({file : files})
  }

  displayStatus = () =>{
    if (this.state.submitted) {
      if (this.state.loading) {
        return <h1>Loading</h1>;
      } else if (this.state.error !== "") {
        return (
          <ErrorDisplay
            headerData={this.state.error}
            message={this.state.message}
            showTry={false}
            handleXClick={this.state.handleXClick}
          />
        );
      } else {
        return (
          <SuccessMessage
            message={this.state.message}
            handleXClick={this.state.handleXClick}
          />
        );
      }
    }
  }

  removeFile = (i)=>{
    let ups = this.state.file;
    ups.splice(i,1);
    this.setState({file : ups});
  }

  displayFiles = () =>{
    return this.state.file.map((file, i) => {
      return (
        <div className="item" key={i}>
          <div className="right floated content">
            <button
              className="ui button secondary"
              onClick={() => this.removeFile(i)}
            >
              Remove
            </button>
          </div>
          <i className="file icon" />
          <div className="content">{file.name}</div>
        </div>
      );
    });
  }

  submitData = () =>{
    const formData = new FormData();
    Object.keys(this.state.file).forEach(key => {
      const file = this.state.file[key];
      formData.append(
        "file",
        new Blob([file], { type: file.type }),
        file.name || "file"
      );
      console.log(file.name);
    });
    tnpbase 
      .post('/test/addData',formData)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            file : [],
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
          error: "Unable to submit data",
          message: err.message
        });
      });
  }

  render(){
    return (
      <div>
        <h2 className="ui center aligned icon header" id="student-header">
          <i className="circular users icon" />
          Import Test DB
        </h2>
        <div className="ui centered grid">
          <div className="eight wide centered column">
            <TestUpload 
              updateFile = {this.selectFiles}
            />
          </div>
          <div className="eight wide column">
            <div style={{ overflowY: "scroll", height: "19em" }}>
              <h3 className="ui header">Selected File(s):</h3>
              <div className="ui middle aligned divided list">
                <p style={{ textAlign: "center" }}>
                  {this.state.file.length === 0
                  ? "Please select files to upload"
                  : ""}
                </p>
                {this.displayFiles()}
              </div>
            </div>
            <br />
            <p>
              Total number of files selected: <b>{this.state.file.length}</b>
            </p>
            <button
              className="ui blue labeled icon right floated  button"
              onClick={() => this.submitData()}
            >
              <i className="upload icon" />
              Upload
            </button>
            <div style={{ marginTop: "55px" }}>{this.displayStatus()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewTestDisplay;
