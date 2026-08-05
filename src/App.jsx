import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/common/ScrollToTop'; // <-- Added
import { useAuth } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Downloader from './pages/Downloader';
import History from './pages/History';
import Profile from './pages/Profile';
import Auth from './pages/Auth';

function ProtectedRoute({ children }) {
  const { session } = useAuth();
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function App() {
  return (
    <Layout>
      <ScrollToTop /> {/* <-- Added */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/downloader" element={<Downloader />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Routes */}
        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

export default App;
