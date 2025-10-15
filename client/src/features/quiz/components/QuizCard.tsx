import { useState } from "react";

type Proposition = {
  text: string;
  is_correct: boolean;
};

type Question = {
  id: number;
  question: string;
  theme: string;
  level: string;
  propositions: Proposition[];
};

type Props = {
  question: Question;
  onAnswer?: (answer: string) => void;
};

export default function QuizCard({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800">
      {/* Question */}
      <div className="bg-yellow-300 text-gray-900 font-bold text-lg rounded-xl px-6 py-5 mb-8 shadow-lg text-center w-80">
        {question.question}
      </div>
      {/* Réponses */}
      <div className="flex flex-col gap-5 w-80">
        {question.propositions.map((p) => {
          let btnStyle =
            "w-full py-3 rounded-md font-semibold text-gray-800 shadow transition transform active:scale-95";
          if (selected === p.text) {
            btnStyle += p.is_correct
              ? " bg-green-400"
              : " bg-red-400";
          } else {
            btnStyle += " bg-yellow-300 hover:bg-yellow-400";
          }
          return (
            <button
              key={p.text}
              className={btnStyle}
              disabled={!!selected}
              onClick={() => {
                setSelected(p.text);
                onAnswer?.(p.text);
              }}
            >
              {p.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}