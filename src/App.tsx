import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from '@/components/NotFound';
import Home from '@/pages/Home'
// Create a Home component that contains your existing app's content

// Main App component with routing
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />
        
        {/* You can add more routes here */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        
        {/* 404 Not Found route - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;