import React from "react";
import tnpbase from '../api/tnpbase';

class TestPerformance extends React.Component  {
  render(){
    return (
      <div className="ui container">
          <h3 className="ui center aligned icon header">
            <i className="cogs icon" />
            <div className="content">
              TestPerformance Performance
              <div className="sub header">Student Performance in tests</div>
            </div>
          </h3>
      </div>
    );
  }
}

export default TestPerformance;
