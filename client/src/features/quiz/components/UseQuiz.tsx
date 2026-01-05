import { useState } from "react";

export type Proposition = {
  text: string;
  is_correct: boolean;
};

export type Question = {
  id: number;
  question: string;
  theme?: string;
  level?: string;
  propositions: Proposition[];
};

export default function useQuiz(questions: Question[], initialIndex = 0) {
  const [currentIdx, setCurrentIdx] = useState<number>(initialIndex);
  const [answers, setAnswers] = useState<(string | undefined)[]>(
    Array(questions.length).fill(undefined)
  );
  const [score, setScore] = useState<number>(0);

  const question = questions[currentIdx];
  const isFinished = currentIdx >= questions.length;


  function selectAnswer(answer: string) {
    if (isFinished) return;
    if (answers[currentIdx]) return; // déjà répondu

    const isCorrect = question?.propositions.find((p) => p.text === answer)
      ?.is_correct;

    const newAnswers = [...answers];
    newAnswers[currentIdx] = answer;
    setAnswers(newAnswers);

    if (isCorrect) setScore((s) => s + 1);

    return isCorrect;
  }

  function next() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setCurrentIdx(questions.length);
    }
  }

  function prev() {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  }

  function restart() {
    setAnswers(Array(questions.length).fill(undefined));
    setScore(0);
    setCurrentIdx(initialIndex);
  }

  return {
    questions,
    currentIdx,
    question,
    answers,
    score,
    isFinished,
    selectAnswer,
    next,
    prev,
    restart,
  };
}