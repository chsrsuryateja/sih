import React from "react";
import tnpbase from '../api/tnpbase';
import { throwStatement } from "@babel/types";

class TestPerformance extends React.Component {
  state = {
    branch_code: -1,
    subj: '',
    subjects: [],
    testData : []
  }

  getSubjects = () => {
    tnpbase
      .get('/tests/subjects')
      .then(res => {
        if (res.data.length === 0) {
          window.alert('No subjects');
        }
        else {
          this.setState({ subjects: res.data });
        }
      })
      .catch(err => {
        console.log(err);
        window.alert('Error' + err);
      })
  }

  componentDidMount = () => {
    this.getSubjects();
  }

  getData = () =>{
    let data = { branch_code : this.state.branch_code , subject : this.state.subj}
    tnpbase
      .post('/test/details',data)
      .then(res =>{
        this.setState({
          testData : res.data
        })
      })
      .catch(err =>{
        console.log(err);
      })
  }


  render() {
    let subjList = this.state.subjects.map((subject, index) => (
      <option key={index} value={subject.subj_id}>{subject.name}</option>
    ));
    return (
      <div className="ui container">
        <h3 className="ui center aligned icon header">
          <i className="cogs icon" />
          <div className="content">
            TestPerformance Performance
              <div className="sub header">Student Performance in tests</div>
          </div>
        </h3>
        <div className="ui form">
          <label>Select Branch : </label>
          <select
            placeholder="Select Branch"
            value={this.state.branch_code}
            onChange={e => {
              this.setState({ branch_code: e.target.value });
            }}>
            <option value="all">All</option>
            <option value={Number('5')}>CSE</option>
            <option value={Number('12')}>IT</option>
            <option value={Number('4')}>ECE</option>
            <option value={Number('3')}>MECH</option>
            <option value={Number('1')}>CIVIL</option>
            <option value={Number('2')}>EEE</option>
          </select>
          <label>Select Subject:</label>
          <select
            value={this.state.subj}
            onChange={e => {
              this.setState({ subj: e.target.value });
            }}
          >
            <option value ="all">All</option>
            {subjList}
          </select>
          <br/>
          <button className="ui button" onClick={() => {
            this.getData();
          }
          }>
            <i className="check icon" />
          </button>
        </div>

      </div>
    );
  }
}

export default TestPerformance;
