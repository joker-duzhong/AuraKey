import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import PromptInput from './components/chat/PromptInput';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col h-screen bg-background text-white">
        <Navbar />
        <div className="flex flex-1 relative overflow-hidden">
          <Sidebar />
          <main className="flex-1 ml-16 flex flex-col relative overflow-hidden bg-[#0c0d13]">
            <Home />
            <PromptInput />
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
