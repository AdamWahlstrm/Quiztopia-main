import React, { Component, ChangeEvent } from "react";

interface AddQuestionProps {
  quizName: string;
}

interface AddQuestionState {
  question: string;
  answer: string;
  lng: number;
  lat: number;
  message: string;
}

class AddQuestion extends Component<AddQuestionProps, AddQuestionState> {
  constructor(props: AddQuestionProps) {
    super(props);
    this.state = {
      question: "",
      answer: "",
      lng: 0,
      lat: 0,
      message: "",
    };
  }

  handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ question: e.target.value });
  };

  handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ answer: e.target.value });
  };

  handleLatChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ lat: parseFloat(e.target.value) });
  };

  handleLngChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ lng: parseFloat(e.target.value) });
  };

  handleAddQuestion = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      this.setState({ message: "Log in to add a question" });
      return;
    }

    const url =
      "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question";
    const questionData = {
      name: this.props.quizName,
      question: this.state.question,
      answer: this.state.answer,
      location: {
        longitude: this.state.lng.toString(),
        latitude: this.state.lat.toString(),
      },
    };

    const settings: RequestInit = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(questionData),
    };

    const response = await fetch(url, settings);
    const data = await response.json();

    if (data.success) {
      this.setState({ message: "Question added" });
    } else {
      this.setState({ message: "Failed to add question" });
    }
  };

  render() {
    return (
      <div>
        <label>
          Question:
          <input
            type="text"
            value={this.state.question}
            onChange={this.handleQuestionChange}
            required
          />
        </label>
        <label>
          Answer:
          <input
            type="text"
            value={this.state.answer}
            onChange={this.handleAnswerChange}
            required
          />
        </label>
        <label>
          Latitude:
          <input
            type="number"
            value={this.state.lat}
            onChange={this.handleLatChange}
            required
          />
        </label>
        <label>
          Longitude:
          <input
            type="number"
            value={this.state.lng}
            onChange={this.handleLngChange}
            required
          />
        </label>
        <button onClick={this.handleAddQuestion}>Add Question</button>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default AddQuestion;
