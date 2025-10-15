import mockData from "../data/mockQuiz.json";

const USE_MOCK = true; //  false pour l'API réelle

let quizData = [...mockData.quiz];

// Define the type for a quiz question
export interface QuizQuestion {
  question: string;
  theme: string;
  level: string;
  propositions: { text: string; is_correct: boolean }[];
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
    /* fetch('/api/...') */
  },
  async create() {
    /* fetch POST */
  },
  async delete() {
    /* fetch DELETE */
  },
};

export const quizService = USE_MOCK ? mockApi : realApi;
