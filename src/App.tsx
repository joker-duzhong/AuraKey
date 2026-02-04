import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import PromptInput from './components/chat/PromptInput';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col h-screen bg-background text-white">
          <Navbar />
          <div className="flex flex-1 relative overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0c0d13]">
              <Routes>
                <Route path="/" element={
                  <>
                    <Home />
                    <PromptInput />
                  </>
                } />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
