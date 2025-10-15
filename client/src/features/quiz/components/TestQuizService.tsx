import React, { useState } from "react";
import { quizService } from "../services/quizService";

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

export default function TestQuizService() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [testId, setTestId] = useState("");
  const [result, setResult] = useState<string | null>(null);

  React.useEffect(() => {
    quizService.getAll().then((qs) => setQuestions(qs as Question[]));
  }, []);

  const handleCreate = async () => {
    const item = {
      question: newQuestion,
      theme: "Test",
      level: "Démo",
      propositions: [
        { text: "Oui", is_correct: true },
        { text: "Non", is_correct: false },
        { text: "Peut-être", is_correct: false },
        { text: "Jamais", is_correct: false }
      ]
    };
    const created = await quizService.create(item);
    console.log("Créé :", created);
    quizService.getAll().then((qs) => setQuestions(qs as Question[]));
  };

  const handleDelete = async (id: number) => {
    await quizService.delete(id);
    quizService.getAll().then((qs) => setQuestions(qs as Question[]));
  };

  const handleCheck = async () => {
    if ("checkAnswer" in quizService && typeof quizService.checkAnswer === "function") {
      const res = await quizService.checkAnswer(Number(testId), answer);
      setResult(res.correct ? "Bonne réponse !" : "Mauvaise réponse.");
      console.log("Résultat :", res);
    } else {
      setResult("La vérification de la réponse n'est pas disponible.");
      console.warn("quizService.checkAnswer is not available.");
    }
  };

  const handleReset = async () => {
    if ("resetQuiz" in quizService && typeof quizService.resetQuiz === "function") {
      await quizService.resetQuiz();
      quizService.getAll().then((qs) => setQuestions(qs as Question[]));
    } else {
      console.warn("quizService.resetQuiz is not available.");
    }
  };

  return (
    <div style={{padding:20, border:"2px solid #eee", margin:"2em 0"}}>
      <h2>Test QuizService</h2>

      <button onClick={handleReset}>Reset quiz</button>

      <h3>Questions actuelles :</h3>
      <ul>
        {questions.map(q => (
          <li key={q.id}>
            <b>[{q.id}]</b> {q.question} 
            <button onClick={() => handleDelete(q.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <div>
        <h4>Créer une question</h4>
        <input value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder="Intitulé" />
        <button onClick={handleCreate}>Créer</button>
      </div>

      <div>
        <h4>Vérifier une réponse</h4>
        <input value={testId} onChange={e => setTestId(e.target.value)} placeholder="ID question" type="number" />
        <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Réponse" />
        <button onClick={handleCheck}>Tester</button>
        {result && <div style={{fontWeight:"bold"}}>{result}</div>}
      </div>
    </div>
  );
}