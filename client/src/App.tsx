import './App.css'
import Home from './pages/Home.tsx'
import Quiz from './pages/Quiz.tsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { Link, useLocation } from "react-router-dom";

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  )
}

export default App;
