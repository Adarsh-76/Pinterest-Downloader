import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import InstallModal from '../components/ui/InstallModal';

export default function Home() {
  const { canInstall, promptInstall } = usePWAInstall();
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  const handleInstallClick = async () => {
    const accepted = await promptInstall();
    setIsInstallOpen(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem', padding: '0 1rem' }}>
      <h1 style={{ 
        fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
        fontWeight: '800', 
        marginBottom: '1.5rem',
        lineHeight: 1.2,
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Premium Pinterest Downloader
      </h1>
      <p style={{ 
        fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
        opacity: '0.8', 
        maxWidth: '600px', 
        margin: '0 auto 2.5rem' 
      }}>
        Experience the fastest and most beautiful way to save your favorite Pinterest images in high quality.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/downloader" className="btn-primary" style={{ display: 'inline-flex', width: 'auto', padding: '1rem 2rem' }}>
          Start Downloading <ArrowRight size={20} />
        </Link>
        
        {canInstall && (
          <button 
            onClick={() => setIsInstallOpen(true)} 
            className="btn-secondary"
            style={{ display: 'inline-flex', width: 'auto', padding: '1rem 2rem', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={20} /> Install App
          </button>
        )}
      </div>

      <InstallModal 
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
        onInstall={handleInstallClick}
      />
    </div>
  );
}
