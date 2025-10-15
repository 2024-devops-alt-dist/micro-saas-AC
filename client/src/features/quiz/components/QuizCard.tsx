import { useState } from "react";

type Proposition = {
  text: string;
  is_correct: boolean;
};

type Question = {
  id: number;
  question: string;
  theme?: string;
  level?: string;
  propositions: Proposition[];
};

type Props = {
  question: Question;
  selected?: string | null;
  onSelect?: (answer: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
};

export default function QuizCard({
  question,
  selected,
  onSelect,
  onPrev,
  onNext,
  disablePrev = false,
  disableNext = false,
}: Props) {
  const [localSelected, setLocalSelected] = useState<string | null>(null);

  // Utilise la sélection du parent si présente, sinon locale
  const sel = selected ?? localSelected;

  const handleClick = (p: Proposition) => {
    setLocalSelected(p.text);
    onSelect?.(p.text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
        {/* Question */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8 w-80">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Montserrat, Arial, sans-serif" }}>
          {question.question}
        </h2>
      </div>
      {/* Réponses */}
      <div className="flex flex-col gap-7 w-80 mb-12">
        {question.propositions.map((p, idx) => {
          let btnStyle = "w-full py-4 rounded-lg font-bold text-lg text-black transition";
          if (sel === p.text) {
            btnStyle += p.is_correct
              ? " bg-green-400"
              : " bg-red-400";
          } else if (idx === 0) {
            btnStyle += " bg-green-400";
          } else {
            btnStyle += " bg-yellow-200";
          }
          return (
            <button
              key={p.text}
              className={btnStyle}
              style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
              disabled={!!sel}
              onClick={() => handleClick(p)}
            >
              {p.text}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-7 mt-2">
        <button
          onClick={onPrev}
          disabled={disablePrev}
          className="px-6 py-3 rounded-lg bg-yellow-200 shadow font-bold text-black text-base transition active:scale-95 disabled:opacity-50"
          style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
        >
          question<br />précédente
        </button>
        <button
          onClick={onNext}
          disabled={disableNext}
          className="px-6 py-3 rounded-lg bg-yellow-200 shadow font-bold text-black text-base transition active:scale-95 disabled:opacity-50"
          style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
        >
          question<br />suivante
        </button>
      </div>
    </div>
  );
}