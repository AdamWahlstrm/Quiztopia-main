import mapboxgl from "mapbox-gl";
import React, { Component, ChangeEvent } from "react";
import AddQuestion from "./AddQuestion";
import Map from "./Map";

interface CreateQuizState {
  quizName: string;
  message: string;
}

class CreateQuiz extends Component<{}, CreateQuizState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      quizName: "",
      message: "",
    };
  }

  handleQuizNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ quizName: e.target.value });
  };

  handleCreateQuiz = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      this.setState({ message: "You must be logged in to create a quiz" });
      return;
    }

    const url = "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz";
    const settings: RequestInit = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: this.state.quizName,
      }),
    };

    const response = await fetch(url, settings);
    const data = await response.json();

    if (response.status === 401) {
      this.setState({ message: "Invalid token." });
      return;
    }

    if (data.success) {
      this.setState({ message: `Quiz ${data.quizId} created` });
    } else {
      this.setState({ message: "Failed to create quiz" });
    }
  };

  render() {
    return (
      <div className="container">
        <h1>Create Quiz</h1>
        <label>
          Quiz Name:
          <input
            type="text"
            value={this.state.quizName}
            onChange={this.handleQuizNameChange}
            required
          />
        </label>
        <button onClick={this.handleCreateQuiz}>Create Quiz</button>
        <p>{this.state.message}</p>
        <AddQuestion quizName={this.state.quizName} />
      </div>
    );
  }
}

export default CreateQuiz;
