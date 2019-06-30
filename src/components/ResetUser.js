import React from "react";
import tnpbase from "../api/tnpbase";

class ResetUser extends React.Component {
  state = { allUsers: [], selectUser: "", password: "" , text: ""};
  getAllUsers = () => {
    tnpbase.get("/users/all").then(res => {
      this.setState({ allUsers: res.data.result });
    });
  };
  componentDidMount = () => {
    this.getAllUsers();
  };
  handleReset = (e) => {
    e.preventDefault();
    this.setState({text: "Loading.."})
    const data = {selected_user: this.state.selectUser, password: this.state.password}
    tnpbase.post("/user/reset", {data} ).then(res => {
      this.setState({text: res.data.status})
    } ).catch(err => {
      console.log(err);
      this.setState({text: err.message})
    })
  }

  render() {
    return (
      <div className="ui container">
        <h2 style={{textAlign: "center"}}>
          Reset Password
        </h2>
        <form className="ui form">
          <div className="field">
            <label>User</label>
            <select
              value={this.state.selectUser}
              onChange={e => this.setState({ selectUser: e.target.value })}
            >
              <option value="">Select user</option>
              {this.state.allUsers.map((user, userIndex) => {
                return <option value={user.user_id}>{user.user_name}</option>;
              })}
            </select>
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="text"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <button className="ui secondary button" onClick={this.handleReset}>
            Reset Password
          </button>
        </form>
        <div>{this.state.text}</div>
      </div>
    );
  }
}

export default ResetUser;
