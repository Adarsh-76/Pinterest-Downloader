import { useState } from 'react';

export function usePinterestExtractor() {
  const [mediaData, setMediaData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const extractImage = async (url) => {
    setIsLoading(true);
    setError('');
    setMediaData(null);

    try {
      // Use the deployed backend URL, or fallback to /api for local dev
      const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
      const response = await fetch(`${baseUrl}/api/extract?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract media.');
      }

      setMediaData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to extract image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { mediaData, isLoading, error, extractImage };
}
