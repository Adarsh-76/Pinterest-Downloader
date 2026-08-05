import { useState } from 'react';

export function useUrlValidation() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validatePinterestUrl = (input) => {
    // Updated regex to accept:
    // 1. pin.it/anything
    // 2. pinterest.com/pin/123...
    // 3. pinterest.com/search/...
    // 4. pinterest.nz, pinterest.co.uk, etc.
    const pinterestRegex = /^(https?:\/\/)?(www\.)?(pin\.it\/[a-zA-Z0-9]+|pinterest\.[a-z]{2,3}(\.[a-z]{2})?\/(pin\/\d+|search\/pins\/\?q=[\w\d%]+|\w+\/?))/i;
    
    if (!input) {
      setError('Please enter a URL.');
      return false;
    }
    
    if (!pinterestRegex.test(input)) {
      setError('Please enter a valid Pinterest URL (e.g., https://pin.it/... or https://pinterest.com/pin/...).');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    if (error) setError(''); // Clear error on type
  };

  return { url, error, validatePinterestUrl, handleChange };
}
