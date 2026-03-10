import mockData from "../data/mockQuiz.json";

const USE_MOCK = true; //  false pour l'API réelle

let quizData = [...mockData.quiz];
const API_URL = import.meta.env.VITE_API_URL || 'https://api.senga200.ovh/api';


// Define the type for a quiz question
export interface QuizQuestion {
  question: string;
  theme: string;
  level: string;
  propositions: { text: string; is_correct: boolean }[];
  id?: number;
}

//Simule les appels API
const mockApi = {
  //retourne une copie du tableau de quiz depuis le mock
  async getAll() {
    return [...mockData.quiz];
  },
  async create(item: QuizQuestion) {
    const newQuestion = { id: Date.now(), ...item };
    quizData.push(newQuestion);
    return newQuestion;
  },
  async delete(id: number) {
    const initialLength = quizData.length;
    quizData = quizData.filter((q) => q.id !== id);
    return { success: quizData.length < initialLength };
  },
  //Vérifie si la réponse de l'utilisateur est correcte
  async checkAnswer(id: number, userAnswer: string) {
    const question = quizData.find((q) => q.id === id);
    const correct = question?.propositions.find((p) => p.is_correct)?.text;
    return { correct: correct === userAnswer };
  },
};

const realApi = {
  async getAll() {
    const response = await fetch(`${API_URL}/questions/`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des questions');
    return response.json();
  },
  async create(item: QuizQuestion) {
    const response = await fetch(`${API_URL}/questions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la question');
    return response.json();
  },
  async delete(id: number) {
    const response = await fetch(`${API_URL}/questions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la question');
    return response.json();
  },
  //Vérifie si la réponse de l'utilisateur est correcte
  async checkAnswer(id: number, userAnswer: string) {
    const response = await fetch(`${API_URL}/questions/${id}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ answer: userAnswer }),
    });
    if (!response.ok) throw new Error('Erreur lors de la vérification de la réponse');
    return response.json();
  },
};

export const quizService = USE_MOCK ? mockApi : realApi;
