
type ResultProps = {
  score: number;
  questions: {  
    question: string;
    propositions: { text: string; is_correct: boolean }[];
  }[];
  answers: (string | undefined)[];
};


function QuizResult({ score, questions, answers }: ResultProps) {
  return (
    <div>
        Résultat du quiz !
        <p>Votre score :  {score}/{questions.length}</p>
        <ul>
          {questions.map((q, i) => (
            <li key={i}>
              Question {i + 1}: {q.question}
              <br />
              Votre réponse: {answers[i]}
              <br />
              Réponse correcte: {q.propositions.find(p => p.is_correct)?.text}
            </li>
          ))}
        </ul>
    </div>
  )
}

export default QuizResult
