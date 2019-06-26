import React from "react";
import tnpbase from "../api/tnpbase";

class SearchStudent extends React.Component {
  state = {
    rollNumber: "",
    editDetail: -1,
    personalDetails: [],
    editable : "",
    content: "",
    driveDetails: []
  };

  getStudentData = () => {
    const data = { HTNO: this.state.rollNumber };
    tnpbase
      .post('/student/details', data)
      .then((result) => {
        this.setState({
          personalDetails: result.data.personal,
          driveDetails: result.data.drives
        });
      })
      .catch((err) => {
        console.log(err);
      })
  };

  buttonHandle = (detail,data,contentIndex) => {
    return(
      this.state.editDetail === contentIndex ? (
        <div className="ui basic icon buttons">
          <button
            className="ui  button"
            style={{ margin: "5px" }}
            onClick={() => {
              console.log("submit" , this.state.content);
              let ups = this.state.personalDetails;
              ups[detail] = this.state.content;
              tnpbase 
                .post('/student/editDetail',ups)
                .then(()=>{
                  this.getStudentData();
                  console.log("Succesfull");
                  this.setState({editDetail : -1})
                })
                .catch((err)=>{console.log(err)})
            }
            }>
            <i className="check icon"/>
          </button>
          <button
            className="ui button"
            onClick={() => {
              console.log("Abort")
              this.setState({editDetail : -1})
            }}
          >
            <i className="x icon" />
          </button>
        </div>
      ) : (
          <div>
            <button
              className="ui  secondary button"
              style={{ margin: "5px" }}
              onClick={() => {
                this.setState({ editDetail: contentIndex, content:data });
              }}
            >
              <i className="pencil alternate icon" />
              Edit
              </button>
          </div>
        )
    );

  }

  contentHandle = (data , contentIndex ) =>{
    return(
      this.state.editDetail === contentIndex ? (
        <div class="ui input">
        <input
          type="text"
          value={this.state.content}
          onChange={e => {
            this.setState({ content : e.target.value });
          }}
        />
        </div>
      ) : (
          <div>
            {data}
          </div>
        )
    );
  }

  personalData = () => {
    // this.state.personalDetails = { "htno": "17a31a0534", "haha": "adwew" };

    if (this.state.personalDetails.length === 0) {
      return (
        <tr>
          <td colSpan={3}>It's Lonely Here</td>
        </tr>
      );
    }
    let details = Object.keys(this.state.personalDetails);
    let content = Object.values(this.state.personalDetails);
    
    return (
      details.map((detail, contentIndex) => {
        return (
          <tr key={contentIndex}>
            <td>{detail}</td>
            <td>{this.contentHandle(content[contentIndex],contentIndex)}</td>
            <td>{this.buttonHandle(detail,content[contentIndex] , contentIndex)}</td>
          </tr>
        )
      })
    );
  }

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
            <button
              class="ui secondary button"
              onClick={this.getStudentData}
            >
              Search
            </button>
          </div>
        </div>
        <div>
          <br />
          <div className="ui container">
            <table className="ui blue table">
              <caption style={{ fontSize: '25px', height: "25px" }}>Personal Details</caption>
              <thead>
                <tr>
                  <th>Detail</th>
                  <th>Content</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.personalData()}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchStudent;
