import React from "react";
import tnpbase from "../api/tnpbase";

class AddUser extends React.Component {
  state = { username: "", password: "", role: "", text: "", branch: "" ,display:""};

  addUser = () => {
    this.setState({ text: "loading" });
    const data = {
      user: this.state.username,
      password: this.state.password,
      role: this.state.role,
      branch: this.state.branch
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
    if(this.state.role === "" || this.state.role === "TPO"){
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
                onChange={e => {
                  this.setState({ role: e.target.value })}}
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
    else if(this.state.role === "PCO")
    {
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
                <option value="pco">PCO</option>
              </select>
            </div>
            <div className="field" style={{display:this.state.display}}>
              <label>Branch</label>
              <select
                value={this.state.branch}
                onChange={e => this.setState({ branch: e.target.value })}
              >
                <option value="">Select Branch</option>
                <option value="05">CSE</option>
                <option value="12">IT</option>
                <option value="04">ECE </option>
                <option value="02">EEE </option>
                <option value="01">CIVIL </option>
                <option value="03">MECH</option>
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
}

export default AddUser;
