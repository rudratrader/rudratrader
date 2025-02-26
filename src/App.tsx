import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home/>} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;
