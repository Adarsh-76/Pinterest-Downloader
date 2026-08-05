import { Link2, Download, AlertCircle, Image as ImageIcon, Video } from 'lucide-react';
import RippleButton from '../components/ui/RippleButton';
import { useUrlValidation } from '../hooks/useUrlValidation';
import { usePinterestExtractor } from '../hooks/usePinterestExtractor';
import { useDownloadHistory } from '../hooks/useDownloadHistory';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import '../styles/downloader.css';

export default function Downloader() {
  const { url, error: urlError, validatePinterestUrl, handleChange } = useUrlValidation();
  const { mediaData, isLoading, error: extractError, extractImage } = usePinterestExtractor();
  const { saveToHistory } = useDownloadHistory();
  const { session } = useAuth();
  const { addToast } = useToast();

  const handleDownload = (e) => {
    e.preventDefault();
    if (validatePinterestUrl(url)) {
      extractImage(url);
    }
  };

  const handleSaveMedia = async () => {
    // 1. Save to database if user is logged in
    if (session && mediaData) {
      await saveToHistory(session.user.id, mediaData);
      addToast('Saved to your history!', 'success');
    } else if (!session) {
      addToast('Login to save your history.', 'info');
    }
    
    // 2. Trigger the actual file download (clicks the hidden link)
    document.getElementById('hidden-download-link').click();
  };

  return (
    <div className="downloader-container">
      {/* Input Card */}
      <div className="bento-card card-input">
        <div className="input-group">
          <label className="input-label">Pinterest URL</label>
          <div className="input-wrapper">
            <Link2 className="input-icon" size={20} />
            <input 
              type="text" 
              className="text-input" 
              placeholder="https://pinterest.com/pin/... or pin.it/..."
              value={url}
              onChange={handleChange}
            />
          </div>
          {urlError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} color="#ef4444" />
              <span className="error-text">{urlError}</span>
            </div>
          )}
          
          <RippleButton onClick={handleDownload} disabled={isLoading}>
            {isLoading ? 'Extracting...' : 'Extract Media'}
            {!isLoading && <Download size={20} />}
          </RippleButton>
        </div>
      </div>

      {/* Info Card */}
      <div className="bento-card card-info">
        <h3 style={{ marginBottom: '1rem' }}>How it works</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.8 }}>
          1. Copy the URL of the Pinterest pin (Image or Video).
          <br /><br />
          2. Paste it into the input box and click "Extract Media".
        </p>
      </div>

      {/* Preview Card */}
      <div className="bento-card card-preview">
        {isLoading ? (
          <div style={{ width: '100%', height: '250px' }}>
            <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
          </div>
        ) : extractError ? (
          <div style={{ textAlign: 'center', color: '#ef4444' }}>
            <AlertCircle size={48} />
            <p style={{ marginTop: '1rem' }}>{extractError}</p>
          </div>
        ) : mediaData ? (
          <div style={{ textAlign: 'center', width: '100%' }}>
            {mediaData.isVideo ? (
              <video src={mediaData.mediaUrl} controls style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '1rem' }} />
            ) : (
              <img src={mediaData.mediaUrl} alt={mediaData.title} style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '1rem' }} />
            )}
            
            {/* 
              The visible button that saves to DB and triggers the download 
            */}
            <button onClick={handleSaveMedia} className="btn-primary" style={{ textDecoration: 'none' }}>
              {mediaData.isVideo ? <Video size={20} /> : <Download size={20} />} Save Media
            </button>

            {/* 
              The hidden anchor tag that actually performs the file download
            */}
            <a 
              id="hidden-download-link"
              href={`${import.meta.env.VITE_BACKEND_URL || ''}/api/download?url=${encodeURIComponent(mediaData.mediaUrl)}&isVideo=${mediaData.isVideo}`}
              style={{ display: 'none' }}
              download
            >
              Download
            </a>
          </div>
        ) : (
          <div style={{ textAlign: 'center', opacity: 0.5 }}>
            <ImageIcon size={48} />
            <p style={{ marginTop: '1rem' }}>Preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
