import React, { Component, ChangeEvent } from "react";

interface LoginState {
  username: string;
  password: string;
  message: string;
}

class Login extends Component<{}, LoginState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: "",
    };
  }

  handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: e.target.value });
  };

  handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  handleLogin = async () => {
    const url =
      "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login";
    const settings: RequestInit = {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    };

    const response = await fetch(url, settings);
    const data = await response.json();
    console.log("handleLogin: ", data);

    if (data.success) {
      this.setState({ message: "Login successful" });
      sessionStorage.setItem("token", data.token);
    } else {
      this.setState({ message: "Login failed" });
    }
  };

  render() {
    return (
      <div className="container">
        <h1>Login</h1>
        <label>
          Username:
          <input
            type="text"
            value={this.state.username}
            onChange={this.handleUsernameChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            required
          />
        </label>
        <button onClick={this.handleLogin}>Login</button>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Login;
