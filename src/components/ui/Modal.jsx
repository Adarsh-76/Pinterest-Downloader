import { AlertTriangle, LogOut } from 'lucide-react';
import '../../styles/modal.css';

export default function Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  isDanger 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className={`modal-icon ${isDanger ? 'modal-icon-warning' : 'modal-icon-info'}`}>
            {isDanger ? <AlertTriangle size={24} /> : <LogOut size={24} />}
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>
        
        <p className="modal-message">{message}</p>
        
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className={isDanger ? 'btn-danger' : 'btn-primary'} 
            onClick={onConfirm}
            style={!isDanger ? { background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' } : {}}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
