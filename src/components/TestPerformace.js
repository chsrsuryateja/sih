import React from "react";
import tnpbase from '../api/tnpbase';
import ErrorDisplay from './ui_utils/ErrorDisplay';

class TestPerformance extends React.Component {
  state = {
    branch_code: '',
    years: [],
    testNames: [],
    subj: '',
    subjects: [],
    yop: '',
    testData: [],
    loading: false,
    error: "",
    message: "",
    submitted: false,
    showTable: [],
    maxPages : 0,
    page: 1
  }

  componentDidMount = () => {
    this.getYears();
  }

  getSubjects = (branch_code) => {
    let data = { branch: branch_code, year: this.state.yop }
    tnpbase
      .post('/tests/subjects', data)
      .then(res => {
        if (res.data.length === 0) {
          window.alert('No subjects');
          this.setState({ subjects: [] });
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

  getYears = () => {
    tnpbase
      .post('/tests/passing')
      .then(res => {
        if (res.data.result.length !== 0) {
          this.setState({ years: res.data.result });
        } else {
          this.setState({ years: [] });
        }
      })
  }

  getTestNames = (branch_code) => {
    let data = { branch: branch_code, year: this.state.yop }
    tnpbase
      .post('/tests', data)
      .then(res => {
        if (res.data.tests.length === 0) {
          window.alert('No tests');
          this.setState({ testNames: [], testData: [] });
        }
        else {
          this.setState({ testNames: res.data.tests });
        }
      })
      .catch(err => {
        console.log(err);
        window.alert('Error' + err);
      })

  }

  getData = () => {
    let data = { branch_code: this.state.branch_code, subject: this.state.subj, yop: this.state.yop }
    tnpbase
      .post('/display/testdata', data)
      .then(res => {
        this.setState({ submitted: true, loading: true });
        if (res.status === 200) {
          if (res.data.testData.length !== 0) {
            this.setState({
              testData: res.data.testData,
              maxPages : Math.ceil(res.data.testData.length/10),
              loading: false,
              message: res.data.status,
              error: "",
              showTable: data
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

  yearDisplay = () => {
    return this.state.years.map((year, i) => {
      return <option key={i} value={year}>{year}</option>
    })
  }

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

  enableContents = () => {
    let ups = this.state.submitted;
    this.setState({ submitted: !ups });
  }

  tableData = () => {
    if (this.state.submitted === false) {
      return (
        <tr>
          <td colSpan={2}>Submit cheyandi mundu </td>
        </tr>
      );
    } else {
      if (this.state.testData.length === 0) {
        return (
          <tr>
            <td colSpan={this.state.testNames.length + 2}>It's Lonely Here</td>
          </tr>
        );
      }
      let studentData = this.state.testData;
      let page = this.state.page;
      return studentData.map((data, index) => {
        if(index >= (page-1)*10 && index <=(page*10) ){
          return (
            <tr key={index}>
              <td>{data.rollNumber}</td>
              {this.displayMarks(data)}
              <td>{data.avg}</td>
            </tr>
          );
          
        }
      })
    }

  }

  displayMarks = (values) => {
    let tests = Object.keys(values);
    tests.pop();
    tests.splice(0, 1);
    let scores = Object.values(values);
    scores.pop();
    scores.splice(0, 1);
    let temp = [];
    let subs = this.state.showTable.subject;
    if(subs === "all"){
      for (let i = 0; i < this.state.testNames.length; i++) {
        for (let j = 0; j < this.state.subjects.subjects.length; j++) {
          if (typeof (values[this.state.testNames[i]]) !== 'undefined') {
            if (typeof (values[this.state.testNames[i]][this.state.subjects.subjects[j]]) === 'undefined'){
              temp.push(
                <td key={j}>{0}</td>
              );
            }
            else {
              temp.push(
                <td key={j}>{values[this.state.testNames[i]][this.state.subjects.subjects[j]]}</td>
              );
            }
  
          } else {
            temp.push(
              <td>Absent</td>
            );
          }
        }
      }
      return temp.map((val) => {
        return val;
      })
    } else{
      for(let i=0;i<this.state.testNames.length;i++){
        if (typeof (values[this.state.testNames[i]]) !== 'undefined') {
          if (typeof (values[this.state.testNames[i]][this.state.showTable.subject]) === 'undefined'){
            temp.push(
              <td key={i}>{0}</td>
            );
          }
          else {
            temp.push( <td key={i} colSpan={this.state.subjects.subjects.length}>{values[this.state.testNames[i]][this.state.showTable.subject]}</td>);
          }
        } else {
          temp.push(
            <td>Absent</td>
          );
        }
      }
      return temp.map((val) => {
        return val;
      })
    }
  }

  testsDisplay = () => {
    if(this.state.submitted !== true){
      return 
    }
    else{
      return this.state.testNames.map((test, i) => {
        return (
          <th key={i} colSpan={this.state.subjects.subjects.length}>
            {test}
          </th>
        );
      });

    }
  }

  subjDisplay = () => {
    if(this.state.submitted !== true){
      return
    } else{
      if (this.state.showTable.subject === 'all' && this.state.subjects.length !== 0) {
        let subjects = this.state.subjects.subjects.map((sub, i) => (
          <th key={i}>{sub}</th>
        ));
        let list = []
        let i = 0;
        for (i = 0; i < this.state.testNames.length; i++) {
          list.push(subjects);
        }
  
        return list.map((ele) => {
          return ele;
        })
      } else {
        let list = []
        let i = 0;
        for (i = 0; i < this.state.testNames.length; i++) {
          list.push(<th key={i} colSpan={this.state.subjects.subjects.length}>{this.state.showTable.subject}</th>);
        }
        return list.map((ele) => {
          return ele;
        })
      }

    }
  }

  subjectDisplay = () => {
    let list = this.state.subjects;
    if (list.length !== 0) {
      return list.subjects.map((val, i) => {
        return <option value={val} key={i}>{val}</option>
      })
    }

  }

  enablePage = (pageNo) => {
    this.setState({ page: pageNo });
  }

  pageCount = () => {
    if (this.state.testData.length === 0) {
      return <a key={0} className="disabled item">{1}</a>
    } else {
      let temp = [];
      let maxPage = Math.ceil(this.state.testData.length / 10);
      for (let i = 1; i <= maxPage; i++) {
        if (i === this.state.page) {
          temp.push(<a key={i} className="active item">{i}</a>);
        } else {
          temp.push(<a key={i} className="item" onClick={() => {
            this.enablePage(i);
          }}>{i}</a>);
        }
      }
      return temp.map((page) => {
        return page;
      })
    }
  }

  render() {
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
          <label>Enter Year of Passing</label>
          <select
            value={this.state.yop}
            placeholder="Enter Year of passing"
            onChange={e => {
              this.setState({ yop: e.target.value });
            }
            }
          >
            <option value="">Select YOP</option>
            {this.yearDisplay()}
          </select>
          <label>Select Branch : </label>
          <select
            placeholder="Select Branch"
            value={this.state.branch_code}
            onChange={e => {
              this.getSubjects(e.target.value);
              this.getTestNames(e.target.value);
              this.setState({ branch_code: e.target.value });
            }}>
            <option value={''}>Select Branch</option>
            <option value={'all'}>All</option>
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
            <option value=''>Select Subject</option>
            <option value="all">All</option>
            {this.subjectDisplay()}
          </select>
          <br />
          <button className="ui button" onClick={() => {
            this.enableContents();
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
          <div className="ui rounded container">
            <table className="ui blue celled structured striped compact table" style={{overflowX:'scroll'}}>
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
          <br />
          <div className="ui pagination menu" style={{ float: "right" }}>
            {this.pageCount()}
          </div>
          <br />
          <br />
        </div>
      </div>
    );
  }
}

export default TestPerformance;
