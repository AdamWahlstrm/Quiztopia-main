import React, { Component, ChangeEvent } from "react";
import Map from "./Map";

interface Quiz {
  userId: string;
  quizId: string;
}

interface Question {
  location: {
    longitude: string;
    latitude: string;
  };
  question: string;
}

interface ViewAllState {
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
  quizData: { questions: Question[] } | null;
}

class ViewAll extends Component<{}, ViewAllState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      quizzes: [],
      selectedQuiz: null,
      quizData: null,
    };
  }

  fetchQuizzes = async () => {
    const response = await fetch(
      "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz"
    );
    const data = await response.json();
    console.log("API response:", data);
    this.setState({ quizzes: data.quizzes });
  };

  fetchQuizData = async () => {
    const { selectedQuiz } = this.state;
    if (selectedQuiz) {
      const url = `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${selectedQuiz.userId}/${selectedQuiz.quizId}`;
      const response = await fetch(url);
      const data = await response.json();
      this.setState({ quizData: data.quiz });
    }
  };

  componentDidMount() {
    this.fetchQuizzes();
  }

  componentDidUpdate(prevProps: {}, prevState: ViewAllState) {
    if (prevState.selectedQuiz !== this.state.selectedQuiz) {
      this.fetchQuizData();
    }
  }

  render() {
    const { quizzes, selectedQuiz, quizData } = this.state;

    return (
      <div>
        <h1>All Quizzes</h1>
        <select
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            this.setState({ selectedQuiz: JSON.parse(e.target.value) })
          }
        >
          <option value="">Select a quiz</option>
          {quizzes.map((quiz, index) => (
            <option
              key={index}
              value={JSON.stringify({ userId: quiz.userId, quizId: quiz.quizId })}
            >
              {quiz.quizId}
            </option>
          ))}
        </select>

        {quizData && <Map questions={quizData.questions} />}
      </div>
    );
  }
}

export default ViewAll;
