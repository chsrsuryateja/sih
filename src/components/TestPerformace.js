import React from "react";
import tnpbase from '../api/tnpbase';
import ErrorDisplay from './ui_utils/ErrorDisplay';


class TestPerformance extends React.Component {
  state = {
    branch_code: -1,
    testNames: ['haha', 'hello','crt'],
    subj: '',
    subjects: ['aptitude', 'verbal', 'C'],
    yop: '',
    testData: [{
      rollNumber: '17A534',
      haha: [{
        aptitude: 28,
        C: 29
      }],
      hello: [{
        aptitude: 20,
        C: 19
      }],
      Avg: 27
    },
    {
      rollNumber: '17A546',
      haha: [{
        aptitude: 30,
        C: 26
      }],
      hello: [{
        aptitude: 27,
        C: 10
      }],
      Avg: 28
    }
    ],
    loading: false,
    error: "",
    message: "",
    submitted: false
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
    // this.getSubjects();
  }

  getData = () => {
    let data = { branch_code: this.state.branch_code, subject: this.state.subj, yop: this.state.yop }
    tnpbase
      .post('/test/details', data)
      .then(res => {
        this.setState({ submitted: true, loading: true });
        if (res.status === 200) {
          if (res.data.result.length !== 0) {
            this.setState({
              loading: false,
              message: res.data.status,
              error: "",
              testData: res.data
            });
          } else {
            this.setState({ testData: [], loading: false, error: res.data.status, message: res.data.error })
          }
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
          submitted: true,
          loading: false,
          message: err.message,
          error: "Unable to send data"
        });
      })
  }

  handleXClick = () => {
    this.setState({ submitted: false });
  };

  displayMessage = () => {
    if (this.state.submitted) {
      if (this.state.loading) {
        return <h1>Loading</h1>
      } else if (this.state.error !== "") {
        return (
          <ErrorDisplay
            headerData={this.state.error}
            message={this.state.message}
            showTry={false}
            handleXclick={this.handleXclick}
          />
        );
      }
    }
  }

  enableMessage = () => {
    let ups = this.state.submitted;
    this.setState({ submitted: !ups });
  }

  tableData = () => {
    if (this.state.testData.length === 0) {
      return (
        <tr>
          <td colSpan={3}>It's Lonely Here</td>
        </tr>
      );
    }
    let studentData = this.state.testData;
    return studentData.map((data, i) => {
      return (
        <tr key={i}>
          <td>{data.rollNumber}</td>
          {this.displayMarks(i, data)}
          <td>{data.Avg}</td>
        </tr>
      );
    })

  }

  displayMarks = (i, values) => {
    let tests = Object.keys(values);
    tests.pop();
    tests.splice(0,1);
    let scores = Object.values(values);
    scores.pop();
    scores.splice(0,1);
    let temp =[];
    for(let i=0;i<this.state.testNames.length;i++)
    {
      for(let j=0;j<this.state.subjects.length;j++)
      {
        if(typeof(values[this.state.testNames[i]])!== 'undefined'){
          // console.log((
          //   values[this.state.testNames[i]][0][this.state.subjects[j]]
          //   ));
          if(typeof(values[this.state.testNames[i]][0][this.state.subjects[j]]) === 'undefined'){

            temp.push(
            <td>{0}</td>
            );
          }
          else{ 
            temp.push(
              <td>{values[this.state.testNames[i]][0][this.state.subjects[j]]}</td>
              );
          }
          
        }else {
          temp.push(
            <td>Absent</td>
          );
        }
      }
    }
    return temp.map((val)=>{
      return val;
    })
  }

  testsDisplay = () => {
    return this.state.testNames.map((test, i) => {
      return (
        <th key={i} colSpan={this.state.subjects.length}>
          {test}
        </th>
      );
    });
  }

  subjDisplay = () =>{
    let subjects = this.state.subjects.map((sub,i)=>(
      <th key = {i}>{sub}</th>
    ));
    let list = []
    let i = 0;
    for(i=0;i<this.state.testNames.length;i++){
      list.push(subjects);
    }
    return list.map((ele)=>{
      return ele;
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
            <option value="all">All</option>
            {subjList}
          </select>
          <label>Enter Year of Passing</label>
          <input
            value={this.state.yop}
            onChange={e => {
              this.setState({ yop: e.target.value })
            }

            }
          />
          <br />
          <br />
          <button className="ui button" onClick={() => {
            this.enableMessage();
            this.getData();
          }
          }>
            <i className="check icon" />
          </button>
        </div>
        <div>
          <br />
          {this.displayMessage()}
        </div>
        <div>
          <br />
          <div className="ui container">
          <table className="ui blue celled structured striped compact table">
          <thead style={{ textAlign: "center" }}>
            <tr>
              <th rowSpan={2}>Roll no.</th>
              {this.testsDisplay()}
              <th rowSpan={2}>Average</th>
            </tr>
            <tr>
              {this.subjDisplay()}
            </tr>
          </thead>
              <tbody>{this.tableData()}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default TestPerformance;
