import { useState, useEffect } from 'react';
import { Mail, Calendar, Trash2, Palette } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useToast } from '../contexts/ToastContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import Modal from '../components/ui/Modal';
import '../styles/profile.css';
import '../styles/downloader.css'; 

export default function Profile() {
  const { session, signOut } = useAuth();
  const { profile, fetchProfile } = useProfile();
  const { addToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (session) {
      fetchProfile(session.user.id);
    }
  }, [session]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const token = session.access_token;
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);
      
      addToast('Account deleted permanently.', 'info');
      await signOut();
      window.location.href = '/'; 
    } catch (error) {
      addToast(error.message, 'error');
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const avatarLetter = session?.user?.email ? session.user.email[0].toUpperCase() : 'U';
  const joinDate = session?.user?.created_at 
    ? new Date(session.user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  return (
    <div className="profile-container">
      {/* Header / Avatar */}
      <div className="bento-card profile-header" style={{ marginTop: '2rem' }}>
        <div className="profile-avatar">
          {avatarLetter}
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            {profile?.username || 'New User'}
          </h2>
          <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{session?.user?.email}</p>
        </div>
      </div>

      {/* Account Details & Danger Zone */}
      <div className="bento-card profile-details">
        <h3 style={{ marginBottom: '1rem' }}>Account Details</h3>
        
        <div className="detail-row">
          <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={16} /> Email
          </span>
          <span className="detail-value">{session?.user?.email}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> Member Since
          </span>
          <span className="detail-value">{joinDate}</span>
        </div>

        {/* Danger Zone */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
          <h4 style={{ color: '#ef4444', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '700' }}>Danger Zone</h4>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="btn-secondary"
            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>
      </div>

      {/* App Preferences */}
      <div className="bento-card profile-sidebar">
        <h3 style={{ marginBottom: '1rem' }}>App Preferences</h3>
        
        <div className="detail-row" style={{ borderBottom: 'none' }}>
          <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={16} /> Dark Mode
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        message="This action is permanent and cannot be undone. All your data, including your profile and download history, will be permanently erased."
        confirmText={isDeleting ? "Deleting..." : "Yes, delete forever"}
        isDanger={true}
      />
    </div>
  );
}
