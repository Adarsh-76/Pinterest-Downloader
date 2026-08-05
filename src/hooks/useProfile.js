import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async (userId) => {
    if (!userId) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateUsername = async (userId, newUsername) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', userId)
      .select();

    if (error) {
      return { success: false, error: error.message };
    } else {
      setProfile(data[0]);
      return { success: true };
    }
  };

  return { profile, loading, fetchProfile, updateUsername };
}
