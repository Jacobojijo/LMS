import React, { useState, useEffect } from "react";
import { colors } from "./CourseComponents";

// ScoreCalculator - Component to calculate and display scores for practice questions and assessments
export const ScoreCalculator = ({
  questions,
  userAnswers,
  passingScore,
  isSubmitted,
  isPractice, // Boolean to differentiate between practice and CAT
  onContinue, // Callback function to continue after reviewing
  onRetry, // Callback function to retry the questions
  setShowAnswers, // Callback to control answer visibility
}) => {
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [passed, setPassed] = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState([]);

  // Calculate score when answers are submitted
  useEffect(() => {
    if (isSubmitted && questions && userAnswers) {
      calculateScore();
    }
  }, [isSubmitted, questions, userAnswers]);

  // Function to calculate the score
  const calculateScore = () => {
    let correctCount = 0;
    const breakdown = [];

    // Calculate correct answers and generate breakdown
    questions.forEach((question, index) => {
      const isCorrect = userAnswers[index] === question.correctAnswer;
      if (isCorrect) correctCount++;

      breakdown.push({
        questionNumber: index + 1,
        userAnswer:
          userAnswers[index] !== undefined
            ? String.fromCharCode(65 + userAnswers[index])
            : "Not answered",
        correctAnswer: String.fromCharCode(65 + question.correctAnswer),
        isCorrect,
      });
    });

    // Calculate percentage
    const calculatedPercentage =
      questions.length > 0
        ? Math.round((correctCount / questions.length) * 100)
        : 0;

    // Determine if passed
    const hasPassed = calculatedPercentage >= passingScore;

    // Update state
    setScore(correctCount);
    setPercentage(calculatedPercentage);
    setPassed(hasPassed);
    setScoreBreakdown(breakdown);

    // Only show answers if passed
    setShowAnswers(hasPassed);
  };

  // If not submitted yet, don't show anything
  if (!isSubmitted) return null;

  return (
    <div
      className="score-results p-6 rounded-lg mt-8 shadow-md"
      style={{ backgroundColor: passed ? "#d1ffd1" : "#ffe6e6" }}
    >
      <h2 className="text-2xl font-bold mb-4">
        {isPractice ? "Practice Results" : "Assessment Results"}
      </h2>

      <div className="score-summary mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg">Your Score:</span>
          <span className="text-xl font-bold">
            {score} / {questions.length}
          </span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg">Percentage:</span>
          <span
            className="text-xl font-bold"
            style={{ color: passed ? "green" : "red" }}
          >
            {percentage}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg">Passing Score:</span>
          <span className="text-xl">{passingScore}%</span>
        </div>

        <div
          className="mt-4 p-3 rounded-md font-bold text-center"
          style={{
            backgroundColor: passed
              ? "rgba(0, 128, 0, 0.2)"
              : "rgba(255, 0, 0, 0.2)",
            color: passed ? "green" : "red",
          }}
        >
          {passed
            ? "Congratulations! You passed!"
            : "You did not meet the passing score. Please review and try again."}
        </div>
      </div>

      {/* Only show answer breakdown if passed */}
      {passed && (
        <div className="score-breakdown mb-6">
          <h3 className="text-xl font-semibold mb-3">Question Breakdown:</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr
                className="border-b-2"
                style={{ borderColor: "rgba(0,0,0,0.1)" }}
              >
                <th className="p-2 text-left">Question</th>
                <th className="p-2 text-left">Your Answer</th>
                <th className="p-2 text-left">Correct Answer</th>
                <th className="p-2 text-left">Result</th>
              </tr>
            </thead>
            <tbody>
              {scoreBreakdown.map((item) => (
                <tr
                  key={item.questionNumber}
                  className="border-b"
                  style={{ borderColor: "rgba(0,0,0,0.1)" }}
                >
                  <td className="p-2">Question {item.questionNumber}</td>
                  <td className="p-2">{item.userAnswer}</td>
                  <td className="p-2">{item.correctAnswer}</td>
                  <td className="p-2">
                    <span style={{ color: item.isCorrect ? "green" : "red" }}>
                      {item.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="navigation-buttons flex justify-between mt-6">
        {!passed && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-md hover:opacity-90 transition"
            style={{ backgroundColor: "#ff6b6b", color: "white" }}
          >
            Try Again
          </button>
        )}

        <button
          onClick={() => onContinue(passed)}
          className="px-4 py-2 rounded-md hover:opacity-90 transition ml-auto"
          style={{ backgroundColor: colors.accent, color: "white" }}
        >
          {passed
            ? isPractice
              ? "Continue to Next Topic"
              : "Complete Module"
            : "Review Content"}
        </button>
      </div>
    </div>
  );
};

// Modified PracticeQuestions Component to include score calculation
export const EnhancedPracticeQuestions = ({
  topic,
  module,
  questions,
  passingScore,
  userAnswers,
  setUserAnswers,
  setActivePage,
  markTopicComplete,
  navigateToNextModule,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  if (!questions || questions.length === 0)
    return <div>No questions available</div>;

  // Check if all questions are answered
  const allQuestionsAnswered = questions.every(
    (_, idx) => userAnswers[idx] !== undefined
  );

  // Handle quiz submission
  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // Handle retry
  const handleRetry = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setShowAnswers(false);
  };

  // Handle continue based on pass/fail status
  const handleContinue = (passed) => {
    if (passed) {
      // If passed, mark topic complete and move to next topic
      markTopicComplete();
    } else {
      // If failed, go back to content for review WITHOUT marking topic complete
      setActivePage("html");
    }
  };

  return (
    <div className="question-content p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {topic.title} - Practice Questions
          </h1>
          <p className="text-gray-600">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div
          className="text-sm p-2 rounded"
          style={{ backgroundColor: colors.lightTeal }}
        >
          Passing Score: {passingScore}%
        </div>
      </div>

      {questions.map((question, qIdx) => (
        <div
          key={qIdx}
          className="question-card p-6 rounded-lg mb-6"
          style={{
            backgroundColor: colors.lightTeal,
            borderLeft: "4px solid " + colors.accent,
          }}
        >
          <p className="text-lg font-medium mb-4">
            Question {qIdx + 1}: {question.question}
          </p>

          <div className="options-list space-y-3">
            {question.options.map((option, optIdx) => (
              <div
                key={optIdx}
                className="option p-4 rounded-md cursor-pointer transition flex items-center"
                style={{
                  backgroundColor: !isSubmitted
                    ? userAnswers[qIdx] === optIdx
                      ? colors.lightRose
                      : colors.white
                    : showAnswers && optIdx === question.correctAnswer
                    ? "#d1ffd1"
                    : userAnswers[qIdx] === optIdx
                    ? "#ffe6e6"
                    : colors.white,
                  border:
                    "1px solid " +
                    (userAnswers[qIdx] === optIdx ? colors.accent : "#ddd"),
                }}
                onClick={() =>
                  !isSubmitted &&
                  setUserAnswers({ ...userAnswers, [qIdx]: optIdx })
                }
              >
                <div
                  className="option-circle w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{
                    backgroundColor:
                      userAnswers[qIdx] === optIdx ? colors.accent : "#f0f0f0",
                    color:
                      userAnswers[qIdx] === optIdx
                        ? colors.white
                        : colors.darkText,
                  }}
                >
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <div className="option-text">{option}</div>
              </div>
            ))}
          </div>

          {/* Only show explanations if passed and answers are to be shown */}
          {isSubmitted && showAnswers && (
            <div
              className="explanation mt-6 p-4 rounded-md"
              style={{ backgroundColor: colors.lightRose }}
            >
              <h3 className="font-bold mb-2">Explanation:</h3>
              <p>{question.explanation}</p>
              <p className="font-bold mt-4">
                {userAnswers[qIdx] === question.correctAnswer
                  ? "✓ Correct!"
                  : "✗ Incorrect. The correct answer is " +
                    String.fromCharCode(65 + question.correctAnswer) +
                    "."}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Score Calculator Component */}
      <ScoreCalculator
        questions={questions}
        userAnswers={userAnswers}
        passingScore={passingScore}
        isSubmitted={isSubmitted}
        isPractice={true}
        onContinue={handleContinue}
        onRetry={handleRetry}
        setShowAnswers={setShowAnswers}
      />

      <div className="navigation-buttons flex justify-between mt-8">
        <button
          onClick={() => setActivePage("topic")}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Back to Overview
        </button>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className="px-4 py-2 rounded-md transition"
            style={{
              backgroundColor: allQuestionsAnswered ? colors.accent : "#ccc",
              color: colors.white,
              opacity: allQuestionsAnswered ? 1 : 0.5,
            }}
          >
            Submit Answers
          </button>
        ) : null}
      </div>
    </div>
  );
};

// Enhanced Assessment Component
export const EnhancedAssessment = ({
  module,
  questions,
  userAnswers,
  setUserAnswers,
  setActivePage,
  navigateToNextModule,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(module.cat.duration * 60); // Convert minutes to seconds
  const [timerActive, setTimerActive] = useState(true);

  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining <= 0 && timerActive) {
      // Auto-submit when time runs out
      setTimerActive(false);
      handleSubmit();
    }

    return () => clearTimeout(timer);
  }, [timeRemaining, timerActive]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!questions || questions.length === 0)
    return <div>No assessment questions available</div>;

  // Check if all questions are answered
  const allQuestionsAnswered = questions.every(
    (_, idx) => userAnswers[idx] !== undefined
  );

  // Handle assessment submission
  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimerActive(false);
  };

  // Handle retry assessment
  const handleRetry = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setShowAnswers(false);
    setTimeRemaining(module.cat.duration * 60);
    setTimerActive(true);
  };

  // Handle continue to next module
  const handleContinue = (passed) => {
    if (passed) {
      navigateToNextModule();
    } else {
      setActivePage("topic"); // Return to module overview
    }
  };

  return (
    <div className="question-content p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{module.cat.title}</h1>
          <p className="text-gray-600">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center">
          <div
            className="text-sm p-2 rounded mr-4"
            style={{ backgroundColor: colors.lightTeal }}
          >
            <div>Passing Score: {module.cat.passingScore}%</div>
          </div>
          <div
            className="text-sm p-2 rounded font-bold"
            style={{
              backgroundColor:
                timeRemaining < 60 ? "#ffe6e6" : colors.lightBeige,
            }}
          >
            Time Remaining: {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {questions.map((question, qIdx) => (
        <div
          key={qIdx}
          className="question-card p-6 rounded-lg mb-6"
          style={{
            backgroundColor: colors.lightBeige,
            borderLeft: "4px solid " + colors.accent,
          }}
        >
          <p className="text-lg font-medium mb-4">
            Question {qIdx + 1}: {question.question}
          </p>

          <div className="options-list space-y-3">
            {question.options.map((option, optIdx) => (
              <div
                key={optIdx}
                className="option p-4 rounded-md cursor-pointer transition flex items-center"
                style={{
                  backgroundColor: !isSubmitted
                    ? userAnswers[qIdx] === optIdx
                      ? colors.lightRose
                      : colors.white
                    : showAnswers && optIdx === question.correctAnswer
                    ? "#d1ffd1"
                    : userAnswers[qIdx] === optIdx
                    ? "#ffe6e6"
                    : colors.white,
                  border:
                    "1px solid " +
                    (userAnswers[qIdx] === optIdx ? colors.accent : "#ddd"),
                }}
                onClick={() =>
                  !isSubmitted &&
                  setUserAnswers({ ...userAnswers, [qIdx]: optIdx })
                }
              >
                <div
                  className="option-circle w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{
                    backgroundColor:
                      userAnswers[qIdx] === optIdx ? colors.accent : "#f0f0f0",
                    color:
                      userAnswers[qIdx] === optIdx
                        ? colors.white
                        : colors.darkText,
                  }}
                >
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <div className="option-text">{option}</div>
              </div>
            ))}
          </div>

          {/* Only show explanations if passed and answers are to be shown */}
          {isSubmitted && showAnswers && (
            <div
              className="explanation mt-6 p-4 rounded-md"
              style={{ backgroundColor: colors.lightRose }}
            >
              <h3 className="font-bold mb-2">Explanation:</h3>
              <p>{question.explanation}</p>
              <p className="font-bold mt-4">
                {userAnswers[qIdx] === question.correctAnswer
                  ? "✓ Correct!"
                  : "✗ Incorrect. The correct answer is " +
                    String.fromCharCode(65 + question.correctAnswer) +
                    "."}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Score Calculator Component */}
      <ScoreCalculator
        questions={questions}
        userAnswers={userAnswers}
        passingScore={module.cat.passingScore}
        isSubmitted={isSubmitted}
        isPractice={false}
        onContinue={handleContinue}
        onRetry={handleRetry}
        setShowAnswers={setShowAnswers}
      />

      <div className="navigation-buttons flex justify-between mt-8">
        {!isSubmitted && (
          <>
            <button
              onClick={() => {
                setTimerActive(false);
                setActivePage("topic");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Exit Assessment
            </button>

            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className="px-4 py-2 rounded-md transition"
              style={{
                backgroundColor: allQuestionsAnswered ? colors.accent : "#ccc",
                color: colors.white,
                opacity: allQuestionsAnswered ? 1 : 0.5,
              }}
            >
              Submit Assessment
            </button>
          </>
        )}
      </div>
    </div>
  );
};
