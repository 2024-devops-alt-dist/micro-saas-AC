import './App.css'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import GererateQuizView from './pages/GenerateQuizView';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { Link, useLocation } from "react-router-dom";

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/generate-quiz" element={<GererateQuizView />} />
      </Routes>
    </Router>
  )
}

export default App;
