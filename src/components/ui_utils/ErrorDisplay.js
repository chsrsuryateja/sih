import React from "react";

const ErrorDisplay = (props) => {
  return (
    <div className="ui negative message">
      <i className="close icon" onClick={props.handleXClick} />
      <div className="header">{props.headerData || "We're sorry we can't connect to the server!"}</div>
      <p>{props.message || "UnKnown Error"}</p>
      <div className="ui blue button" onClick={props.tryAgain} style={{display: props.showTry ? "" : "none"}}>Try Again</div>
    </div>
  );
};


ErrorDisplay.defaultProps = {
  showTry: true,
  headerData: "We're sorry we can't connect to the server!"
}
export default ErrorDisplay;