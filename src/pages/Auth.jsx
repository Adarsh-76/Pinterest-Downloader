import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import RippleButton from '../components/ui/RippleButton';
import { useToast } from '../contexts/ToastContext';
import '../styles/downloader.css';

export default function Auth() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN LOGIC
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        addToast('Logged in successfully!', 'success');
        navigate('/');
      } else {
        // SIGNUP LOGIC
        if (!username.trim()) {
          throw new Error('Please choose a username.');
        }

        // 1. Check if username is already taken
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();

        if (existingUser) {
          throw new Error('This username is already taken. Please choose another.');
        }

        // 2. Sign up the user, passing the username as metadata
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username: username // This gets caught by our new database trigger!
            }
          }
        });

        if (error) throw error;
        
        addToast('Account created! You are now logged in.', 'success');
        
        // Since we turned off email verification, we can log them in instantly
        await supabase.auth.signInWithPassword({ email, password });
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
      <div className="bento-card" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleAuth} className="input-group">
          {/* Username Field (Only for Sign Up) */}
          {!isLogin && (
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input 
                type="text" 
                className="text-input" 
                placeholder="Choose a unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              className="text-input" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              className="text-input" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} color="#ef4444" />
              <span className="error-text">{error}</span>
            </div>
          )}

          <RippleButton type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            {!loading && (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
          </RippleButton>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            style={{ color: 'var(--color-primary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
