import React from "react";
import icon from "../images/icon.png";

class LoginPage extends React.Component {
  state = { username: "", password: "" };
  
  render() {
    return (
      <div
        className="ui middle aligned center aligned grid"
        style={{ marginTop: "125px" }}
      >
        <div className="logincolumn column">
          <h2 className="ui image header">
            <div className="content">Log-in to your account</div>
          </h2>
          <form className="ui form">
            <div className="ui stacked secondary  segment">
              <img
                src={icon}
                alt="prag"
                style={{ width: "100px", height: "100px" }}
              />
              <div className="field">
                <div className="ui left icon input">
                  <i className="user icon" />
                  <input
                    type="text"
                    placeholder="User name"
                    value={this.state.username}
                    onChange={e => this.setState({ username: e.target.value })}
                  />
                </div>
              </div>
              <div className="field">
                <div className="ui left icon input">
                  <i className="lock icon" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={e => this.setState({ password: e.target.value })}
                  />
                </div>
              </div>
              <div
                className="ui fluid large submit secondary button"
                onClick={() => this.props.handleLogin(this.state.username, this.state.password)}
              >
                Login
              </div>
            </div>

            <div className="ui message">
                {this.props.loginError}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginPage;
