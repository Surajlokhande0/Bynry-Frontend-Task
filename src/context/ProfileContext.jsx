import { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as profileService from '../services/profileService';

const ProfileContext = createContext();

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfiles must be used within ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadedRef = useRef(false);

  // Load profiles on mount only once
  useEffect(() => {
    if (!loadedRef.current) {
      loadProfiles();
      loadedRef.current = true;
    }
  }, []);

  const loadProfiles = async () => {
    // Don't reload if we already have profiles
    if (profiles.length > 0 && !error) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfiles();
      setProfiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProfile = async (profile) => {
    try {
      const newProfile = await profileService.addProfile(profile);
      setProfiles(prev => [...prev, newProfile]);
      return newProfile;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (id, profile) => {
    try {
      const updated = await profileService.updateProfile(id, profile);
      setProfiles(prev => prev.map(p => p.id === parseInt(id) ? updated : p));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProfile = async (id) => {
    try {
      await profileService.deleteProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== parseInt(id)));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    profiles,
    loading,
    error,
    loadProfiles,
    addProfile,
    updateProfile,
    deleteProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

