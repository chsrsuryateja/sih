import React from "react";
import tnpbase from "../api/tnpbase";

class SearchStudent extends React.Component {
  state = {
    rollNumber: "",
    editDetail: [],
    detailList: [],
    contentList: []
  };

  getStudentData = () => {
    const data = { HTNO: this.state.rollNumber };
    // console.log(data);
    tnpbase
      .post("search/student", data)
      .then(result => {
        this.setState({
          detailList: Object.keys(result.data),
          contentList: Object.values(result.data)
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  personalData = () => {
    if (this.state.detailList.length === 0) {
      return (
        <tr>
          <td colSpan={3}>It's Lonely here</td>
        </tr>
      );
    }
  };

  driveData = () => {
    if (this.state.detailList.length === 0) {
      return (
        <tr>
          <td colSpan={3}>It's Lonely here</td>
        </tr>
      );
    }
  };

  render() {
    return (
      <div>
        <div className="ui container">
          <h3 className="ui center aligned icon header">
            <i className="search icon" />
            <div className="content">
              Search Student
              <div className="sub header">Details of Student</div>
            </div>
          </h3>
          <div class="ui action input">
            <input
              type="text"
              placeholder="Enter roll no."
              value={this.state.rollNumber}
              onChange={e => {
                this.setState({ rollNumber: e.target.value });
              }}
            />
            <button class="ui secondary button" onClick={this.getStudentData}>
              Search
            </button>
          </div>
        </div>
        <div>
          <br />
          <button
              className="ui secondary button"
              style={{
                float: "right",
                verticalAlign: "middle",
                marginBottom: "5px"
              }}
            >
              Edit Detail
            </button>
            <br/>
          <div className="ui container">
            <table className="ui blue table">
              <thead>
                <th>Personal Details</th>
              </thead>
              <tbody>{this.personalData()}</tbody>
            </table>
          </div>
          <br/>
          <div className="ui container">
            <button
              className="ui secondary button"
              style={{
                float: "right",
                verticalAlign: "middle",
                marginBottom: "5px"
              }}
            >
              Edit Detail
            </button>
            <table className="ui blue table">
              <thead>
                <th>Drive Details</th>
              </thead>
              <tbody>{this.driveData()}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchStudent;
