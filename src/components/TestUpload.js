import React from 'react';
import Files from 'react-files';

class TestUpload extends React.Component {

    render() {
        return (
            <div >
                <Files
                    style={{
                        height: "350px",
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
                    onChange={(files) => this.props.updateFile(files)}
                    accepts={[".xlsx", ".csv"]}
                >
                    <h3>Drag Files here or Click to select</h3>
                </Files>
            </div>
        );
    }
}

export default TestUpload;