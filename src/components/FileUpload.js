import React from "react";
import Files from "react-files";
import { connect } from "react-redux";
import { selectFiles, setRef } from "../actions";

class FileUpload extends React.Component {
  componentDidMount = () => {
    this.props.setRef(this.refs.files)
  }
  render() {
    return (
      <div >
        <Files
          style={{
            height: "400px",
            width: "80%",
            marginLeft: "10%",
            marginRight: "10%",
            border: "1px dashed black",
            textAlign: "center",
            backgroundColor: "aliceblue",
            paddingTop: "180px"
          }}
          ref='files'
          className="ui floating message"
          clickable
          multiple
          onChange={(files) => this.props.selectFiles(files)}
          accepts={[".xlsx",".csv"]}
        >
          <h3>Drag Files here or Click to select</h3>
        </Files>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    files: state.selectedFiles
  };
};

export default connect(
  mapStateToProps,
  { selectFiles, setRef }
)(FileUpload);
