import HomePage from "./pages/home-page";
import QuestionBank from "./pages/questions-page";
import QuestionSetPage from "./pages/question-set-page";
import RecordingPage from "./pages/recording-page";
import AuthPage from "./pages/auth-page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions" element={<QuestionBank />} />
        <Route path="/question-set" element={<QuestionSetPage />} />
        <Route path="/recording" element={<RecordingPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </Router>
  );
};

export default App;
