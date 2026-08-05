import { useState, useEffect } from 'react';
import { Download, Trash2, ImageOff, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDownloadHistory } from '../hooks/useDownloadHistory';
import Modal from '../components/ui/Modal';
import { useToast } from '../contexts/ToastContext';
import '../styles/history.css';

export default function History() {
  const { session } = useAuth();
  const { history, loading, fetchHistory, deleteFromHistory } = useDownloadHistory();
  const { addToast } = useToast();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (session) {
      fetchHistory(session.user.id);
    }
  }, [session]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Open modal and set which item we want to delete
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion from modal
  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteFromHistory(itemToDelete.id);
      addToast('Item removed from history.', 'info');
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '700' }}>Your Download History</h2>
      
      <div className="history-container">
        {loading ? (
          // Skeleton Loaders
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="history-item">
              <div className="skeleton history-media"></div>
              <div className="history-info">
                <div className="skeleton" style={{ width: '80%', height: '16px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '40%', height: '12px', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))
        ) : history.length === 0 ? (
          // Empty State
          <div className="history-empty">
            <ImageOff size={48} style={{ margin: '0 auto 1rem' }} />
            <h3>No history yet</h3>
            <p>Downloaded images and videos will appear here.</p>
          </div>
        ) : (
          // History Items
          history.map((item) => (
            <div key={item.id} className="history-item">
              {item.is_video ? (
                <div className="history-media" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Video size={40} opacity={0.5} />
                </div>
              ) : (
                <img src={item.media_url} alt={item.title} className="history-media" />
              )}
              
              <div className="history-info">
                <div className="history-title">{item.title || 'Untitled Media'}</div>
                <div className="history-date">{formatDate(item.created_at)}</div>
                
                <div className="history-actions">
                  <a 
                    href={`${import.meta.env.VITE_BACKEND_URL || ''}/api/download?url=${encodeURIComponent(item.media_url)}&isVideo=${item.is_video}`}
                    className="history-btn"
                    download
                  >
                    <Download size={14} /> Download
                  </a>
                  <button 
                    className="history-btn delete"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete History Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Media?"
        message="Are you sure you want to remove this from your history? This action cannot be undone."
        confirmText="Yes, delete it"
        isDanger={true}
      />
    </div>
  );
}
