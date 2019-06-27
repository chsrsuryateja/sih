import React from "react";
import tnpbase from "../api/tnpbase";


class SearchStudent extends React.Component {
  state = {
    rollNumber: "",
    editDetail: -1,
    driveEditDetail : -1,
    driveContent : [],
    rounds : [],
    personalDetails: [],
    selectionStatus: ["Selected", "Not Selected"],
    offerStatus: ["Submitted", "Not Submitted"],
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

  getRounds = (drive) =>{
    const data = { drive_name: drive};
    tnpbase 
      .post("/drive/rounds",data)
      .then((result) => {
        this.setState({
          rounds : result.data
        });
      })
      .catch((err) => {
        console.log(err);
      })
  }

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

  driveButtonHandle = (detail,driveIndex) =>{
      return(
        this.state.driveEditDetail === driveIndex ? (
          <div className="ui basic icon buttons">
          <button
            className="ui  button"
            style={{ margin: "5px" }}
            onClick={() => {
              console.log("submit" , detail);
              let ups = this.state.driveDetails;
              ups[driveIndex] = detail;
              tnpbase 
                .post('search/student/driveEditDetail',ups)
                .then(()=>{
                  this.getStudentData();
                  console.log("Succesfull");
                  this.setState({driveEditDetail : -1 , driveContent : []})
                })
                .catch((err)=>{console.log(err)})
            }
            }>
            <i className="check icon"/>
          </button>
          <button
            className="ui button"
            onClick={() => {
              console.log("Abort" , detail);

              this.setState({driveEditDetail : -1 , driveContent : detail})
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
                console.log(driveIndex , detail);
                this.setState({ driveEditDetail: driveIndex, driveContent:detail });
              }}
            >
              <i className="pencil alternate icon" />
              Edit
              </button>
          </div>
        )
    );
  }



  drivesData = () =>{
  let details = this.state.driveDetails;
    if (details.length === 0) {
      return (
        <tr>
          <td colSpan={5}>It's Lonely Here</td>
        </tr>
      );
    }
    return (
      details.map((detail, driveIndex) => {
        this.getRounds(detail.company);
        return (
          <tr key={driveIndex}>
            <td>{detail.company}</td>
            <td>
            {
              this.state.driveEditDetail === driveIndex ? (
              <select
                className="ui search dropdown"
                defaultValue={detail.round_name}
                onChange={e => {
                  detail.round_name = e.target.value;
                  console.log(detail);
                }}
              >
                {this.state.rounds.map(selection => (
                  <option value={selection}>{selection}</option>
                ))}
              </select>
            ) : (
              detail.round_name
            )}
            </td>
            <td>
            {this.state.driveEditDetail === driveIndex ? (
              <select
                className="ui search dropdown"
                defaultValue={detail.selected}
                onChange={e => {
                  detail.selected = e.target.value;
                  console.log(detail);
                }}
              >
                {this.state.selectionStatus.map(selection => (
                  <option value={selection}>{selection}</option>
                ))}
              </select>
            ) : (
              detail.selected
            )}
            </td>
            <td>
            {this.state.driveEditDetail === driveIndex ? (
              <select
                className="ui search dropdown"
                defaultValue={detail.offer_letter}
                onChange={e => {
                  detail.offer_letter = e.target.value;
                  console.log(detail);
                }}
              >
                {this.state.offerStatus.map(selection => (
                  <option value={selection}>{selection}</option>
                ))}
              </select>
            ) : (
              detail.offer_letter
            )}
            </td>
            <td>{this.driveButtonHandle(detail,driveIndex)}</td>
          </tr>
        )
      })
    );
  

  }

  displayForm = () =>{
    return (
      this.state.showForm ? (

        <div>Haha</div>
      
    ) : (
      <p>vachav</p>
    )
    )
    
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

        <div>
          <br />
          <div className="ui container">
            <table className="ui blue table">
              <caption style={{ fontSize: '25px', height: "25px" }}>Drive Details</caption>
              <thead>
                <tr>
                  <th>Drive</th>
                  <th>Round Name</th>
                  <th>Selected</th>
                  <th>Offer Letter</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.drivesData()}</tbody>
            </table>
          </div>
        </div>
        <br/>
        <div className="ui buttons"
          style={{
            float: "right",
            verticalAlign: "middle",
            marginBottom: "5px"
          }}>
          <button 
          className = "ui secondary button "
          onClick ={
            console.log("Hello")
          }
          >
            Add to Drive
          </button>
        </div>
        <div>
          <br/>
          {/* {this.displayForm()} */}
        </div>
      </div>
    );
  }
}

export default SearchStudent;
