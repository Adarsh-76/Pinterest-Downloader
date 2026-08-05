import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useDownloadHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's download history
  const fetchHistory = async (userId) => {
    if (!userId) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching history:', error.message);
    } else {
      setHistory(data);
    }
    setLoading(false);
  };

  // Save a new download to history
  const saveToHistory = async (userId, mediaData) => {
    if (!userId || !mediaData) return;
    
    const { error } = await supabase
      .from('downloads')
      .insert([
        { 
          user_id: userId, 
          media_url: mediaData.mediaUrl, 
          title: mediaData.title, 
          is_video: mediaData.isVideo 
        }
      ]);

    if (error) {
      console.error('Error saving to history:', error.message);
    }
  };

  // Delete a specific download from history
  const deleteFromHistory = async (id) => {
    const { error } = await supabase
      .from('downloads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting from history:', error.message);
    } else {
      // Update local state to remove the deleted item instantly
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return { history, loading, fetchHistory, saveToHistory, deleteFromHistory };
}
