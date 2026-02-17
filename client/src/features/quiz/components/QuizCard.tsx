

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

export default function QuizCardView({
  question,
  selected,
  onSelect,
  onPrev,
  onNext,
  disablePrev = false,
  disableNext = false,
}: Props) {
  const handleClick = (p: Proposition) => {
    onSelect?.(p.text);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      {/* Question Card */}
      <div className="bg-gray-800/60 rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 w-full max-w-md border border-gray-700/50 backdrop-blur-sm">
        <div className="text-yellow-300/50 text-[10px] uppercase tracking-widest font-bold mb-2">Question</div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-tight">
          {question.question}
        </h2>
      </div>

      {/* Réponses */}
      <div className="flex flex-col gap-4 w-full max-w-md mb-12">
        {question.propositions.map((p, idx) => {
          const testId = p.is_correct ? "answer-correct" : "answer-wrong";

          const btnBase = "w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-between group";
          let btnStyle;

          if (selected === p.text) {
            btnStyle = p.is_correct
              ? "bg-green-500 text-white shadow-lg shadow-green-900/40 scale-[1.02]"
              : "bg-red-500 text-white shadow-lg shadow-red-900/40 scale-[1.02]";
          } else {
            btnStyle = "bg-gray-800/40 text-gray-300 border border-gray-700/50 hover:bg-yellow-300 hover:text-gray-900 hover:border-yellow-300 cursor-pointer active:scale-95";
          }

          return (
            <button
              key={`${idx}-${p.text}`}
              data-testid={testId}
              className={`${btnBase} ${btnStyle}`}
              disabled={!!selected}
              onClick={() => handleClick(p)}
            >
              <span>{p.text}</span>
              {selected === p.text && (
                <span className="text-xl">{p.is_correct ? "✓" : "✕"}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 w-full max-w-md justify-between px-2">
        <button
          onClick={onPrev}
          disabled={disablePrev}
          className="flex-1 py-4 px-4 rounded-2xl bg-gray-800 text-gray-400 border border-gray-700 font-bold text-sm transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none hover:bg-gray-700 hover:text-white"
        >
          Précédent
        </button>
        <button
          onClick={onNext}
          disabled={disableNext}
          className="flex-1 py-4 px-4 rounded-2xl bg-yellow-300 text-gray-900 shadow-xl shadow-yellow-900/20 font-bold text-sm transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none hover:bg-yellow-400"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
