import profilesData from '../data/profiles.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all profiles
export const getProfiles = async () => {
  await delay(500); // Simulate network delay
  const stored = localStorage.getItem('profiles');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('profiles', JSON.stringify(profilesData));
  return profilesData;
};

// Get profile by ID
export const getProfileById = async (id) => {
  await delay(300);
  const profiles = await getProfiles();
  return profiles.find(p => p.id === parseInt(id));
};

// Add new profile
export const addProfile = async (profile) => {
  await delay(500);
  const profiles = await getProfiles();
  const newId = Math.max(...profiles.map(p => p.id), 0) + 1;
  const newProfile = {
    ...profile,
    id: newId,
    latitude: parseFloat(profile.latitude),
    longitude: parseFloat(profile.longitude),
  };
  const updatedProfiles = [...profiles, newProfile];
  localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
  return newProfile;
};

// Update profile
export const updateProfile = async (id, updatedProfile) => {
  await delay(500);
  const profiles = await getProfiles();
  const index = profiles.findIndex(p => p.id === parseInt(id));
  if (index === -1) {
    throw new Error('Profile not found');
  }
  const profile = {
    ...updatedProfile,
    id: parseInt(id),
    latitude: parseFloat(updatedProfile.latitude),
    longitude: parseFloat(updatedProfile.longitude),
  };
  profiles[index] = profile;
  localStorage.setItem('profiles', JSON.stringify(profiles));
  return profile;
};

// Delete profile
export const deleteProfile = async (id) => {
  await delay(500);
  const profiles = await getProfiles();
  const filtered = profiles.filter(p => p.id !== parseInt(id));
  localStorage.setItem('profiles', JSON.stringify(filtered));
  return true;
};

