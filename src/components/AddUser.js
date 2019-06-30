import React from "react";
import tnpbase from "../api/tnpbase";

class AddUser extends React.Component {
  state = { username: "", password: "", role: "", text: "" };

  addUser = () => {
    this.setState({ text: "loading" });
    const data = {
      user: this.state.username,
      password: this.state.password,
      role: this.state.role
    };
    tnpbase
      .post("/user/add", { data })
      .then(res => {
        this.setState({ text: res.data.status });
      })
      .catch(err => {
        this.setState({ text: err.message });
        console.log(err);
      });
  };

  render() {
    return (
      <div className="ui container">
        <div className="ui form">
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              value={this.state.username}
              onChange={e => this.setState({ username: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Role</label>
            <select
              value={this.state.role}
              onChange={e => this.setState({ role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="TPO">TPO</option>
              <option value="PCO">PCO</option>
            </select>
          </div>
          <button className="ui secondary button" onClick={this.addUser}>
            Add User
          </button>
          <div>{this.state.text}</div>
        </div>
      </div>
    );
  }
}

export default AddUser;
