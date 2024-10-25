import { useMemo, useState } from "react";
import s from "./Quiz.module.css";
import { MAX_LIVES } from "../../constants/maxLives";
import { QuizQuestion } from "../../types/quizQuestion";
import { getMultipleAnswersQuestion } from "../../utils/getMultipleAnswersQuestion";
import { MultipleAnswersQuestion } from "../MultipleAnswersQuestion/MultipleAnswersQuestion";
import { ReorderQuestion } from "../ReorderQuestion/ReorderQuestion";
import {
  MultipleAnswersQuestion as MultipleAnswersQuestionType,
  ReorderQuestion as ReorderQuestionType,
} from "../../types/quizQuestion";
import { getReorderQuestion } from "../../utils/getReorderQuestion";

export const Quiz = () => {
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(MAX_LIVES);

  const [question, setQuestion] = useState<QuizQuestion>(() =>
    getMultipleAnswersQuestion(2)
  );

  const complexity = useMemo(() => Math.floor(score / 10) + 2, [score]);

  const handleCommitAnswer = (isAnswerCorrect: boolean) => {
    if (isAnswerCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setLives((prev) => prev - 1);
    }
  };

  const handleGetNextQuestion = () => {
    const isMultipleAnswersQuestion = Math.random() < 0.5;

    if (isMultipleAnswersQuestion) {
      setQuestion(getMultipleAnswersQuestion(complexity));
    } else {
      setQuestion(getReorderQuestion(complexity));
    }
  };

  const handleStartNewGame = () => {
    setScore(0);
    setLives(MAX_LIVES);
    setQuestion(getMultipleAnswersQuestion(2));
  };

  return (
    <div className={s.gameContainer}>
      <section className={s.gameData}>
        <span
          className={s.gameDataItem}
          aria-label={`${lives} lives remaining`}
        >
          {new Array(MAX_LIVES).fill(0).map((_, index) => (
            <img
              src={index + 1 <= lives ? "/HeartRed.png" : "/HeartGrey.png"}
              aria-hidden
              className={s.heartIcon}
              alt="Heart icon"
            />
          ))}
        </span>
        <span className={s.gameDataItem}>
          Score:{" "}
          <span className={s.scoreDecoratedFragment}>
            {score}
            <img src="/Circle.png" aria-hidden className={s.scoreDecor} />
          </span>
        </span>
      </section>
      {question.type === "MultipleAnswersQuestion" ? (
        <MultipleAnswersQuestion
          key={question.expression}
          question={question as MultipleAnswersQuestionType}
          isGameOver={lives === 0}
          onGetNextQuestion={handleGetNextQuestion}
          onStartNewGame={handleStartNewGame}
          onCommitAnswer={handleCommitAnswer}
        />
      ) : (
        <ReorderQuestion
          key={question.correctAnswer}
          question={question as ReorderQuestionType}
          isGameOver={lives === 0}
          onGetNextQuestion={handleGetNextQuestion}
          onStartNewGame={handleStartNewGame}
          onCommitAnswer={handleCommitAnswer}
        />
      )}
    </div>
  );
};
