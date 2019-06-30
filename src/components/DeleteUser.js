import React from "react";
import tnpbase from "../api/tnpbase";
class DeleteUser extends React.Component {
  state = { allUsers: [], text: "" };
  getAllUsers = () => {
    tnpbase
      .get("/users/all")
      .then(res => {
        if (res.status === 200) {
          this.setState({ allUsers: res.data.result, text: "" });
        } else {
          this.setState({ text: res.data.status });
        }
      })
      .catch(err => {
        this.setState({ text: err.message });
        console.log(err);
      });
  };

  deleteUser = userID => {
    const data = { userID };
    tnpbase
      .post("/user/delete", { data })
      .then(res => {
        this.setState({ text: res.data.status });
        this.getAllUsers();
      })
      .catch(err => {
        this.setState({ text: err.message });
      });
  };
  componentDidMount = () => {
    this.getAllUsers();
  };

  renderUsers = () => {
    return this.state.allUsers.map(user => {
      return (
        <div className="item">
          <div className="right floated content">
            <button
              className="ui secondary button"
              onClick={() => this.deleteUser(user.user_id)}
            >
              Delete
            </button>
          </div>
          <div className="content">{user.user_name}</div>
        </div>
      );
    });
  };
  render() {
    return (
      <div className="ui container">
        <div className="ui middle aligned divided list">
          {this.renderUsers()}
        </div>
        <div className="ui message" style={{display: this.state.text === "" ? "none" : ""}}>{this.state.text}</div>
      </div>
    );
  }
}

export default DeleteUser;
