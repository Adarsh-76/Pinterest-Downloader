import { Download, X, Zap, Shield, MonitorSmartphone } from 'lucide-react';
import '../../styles/modal.css';

export default function InstallModal({ isOpen, onClose, onInstall }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted-light)' }}>
          <X size={20} />
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            margin: '0 auto 1rem', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
          }}>
            <Download size={32} color="white" />
          </div>
          <h3 className="modal-title" style={{ fontSize: '1.5rem' }}>Install PinGrab App</h3>
          <p className="modal-message" style={{ marginBottom: 0 }}>Get the full premium experience on your device.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)', padding: '0.5rem', borderRadius: '12px' }}>
              <Zap size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Lightning Fast</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Instant access from your home screen.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem', borderRadius: '12px' }}>
              <Shield size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Offline Support</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Access your download history anytime.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--color-secondary)', padding: '0.5rem', borderRadius: '12px' }}>
              <MonitorSmartphone size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>Native Experience</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>No browser tabs, just a clean app UI.</p>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onInstall} style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
            <Download size={20} /> Install Now
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
