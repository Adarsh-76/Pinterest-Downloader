import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, LogIn, LogOut, User, Home, Download, History } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import Modal from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/layout.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const { addToast } = useToast();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleAuthAction = () => {
    if (session) {
      setIsLogoutModalOpen(true);
    } else {
      navigate('/auth');
    }
  };

  const confirmLogout = async () => {
    await signOut();
    setIsLogoutModalOpen(false);
    addToast('Logged out successfully.', 'info');
    navigate('/'); 
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Sparkles size={24} />
            <span>PinGrab</span>
          </Link>
          
          <div className="navbar-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <Home size={18} style={{ flexShrink: 0 }} /> <span>Home</span>
            </Link>
            <Link to="/downloader" className={`nav-link ${location.pathname === '/downloader' ? 'active' : ''}`}>
              <Download size={18} style={{ flexShrink: 0 }} /> <span>Downloader</span>
            </Link>
            
            {session && (
              <>
                <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>
                  <History size={18} style={{ flexShrink: 0 }} /> <span>History</span>
                </Link>
                <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                  <User size={18} style={{ flexShrink: 0 }} /> <span>Profile</span>
                </Link>
              </>
            )}

            <button 
              onClick={handleAuthAction} 
              className="theme-toggle" 
              style={{ width: 'auto', padding: '0 1rem', gap: '0.5rem', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}
              aria-label="Authentication"
            >
              {session ? <LogOut size={18} /> : <LogIn size={18} />}
              <span style={{ color: 'inherit', fontSize: '0.9rem', fontWeight: '500' }}>{session ? 'Logout' : 'Login'}</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </nav>

      <Modal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Log Out?"
        message="Are you sure you want to log out of your account?"
        confirmText="Confirm Logout"
        isDanger={false}
      />
    </>
  );
}
