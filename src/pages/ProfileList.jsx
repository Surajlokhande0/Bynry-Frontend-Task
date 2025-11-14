import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../context/ProfileContext';
import ProfileCard from '../components/ProfileCard';
import Loader from '../components/Loader';
import { debounce } from '../utils/helpers';

const ProfileList = () => {
  const { profiles, loading, error, loadProfiles } = useProfiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Ensure profiles are loaded when component mounts
  useEffect(() => {
    if (profiles.length === 0 && !loading && !error) {
      loadProfiles();
    }
  }, [profiles.length, loading, error, loadProfiles]);

  // Debounced search handler
  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    handleSearchChange(value);
  };

  // Get unique cities for filter
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(profiles.map(p => p.city))].sort();
    return uniqueCities;
  }, [profiles]);

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = !filterCity || profile.city === filterCity;
      return matchesSearch && matchesCity;
    });
  }, [profiles, searchTerm, filterCity]);

  if (loading && profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profiles</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadProfiles}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Profiles</h1>
              <p className="text-gray-600">Browse and explore user profiles</p>
            </div>
            <Link
              to="/admin"
              className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95"
            >
              Admin Panel
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchInput}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="md:w-64">
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600 font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredProfiles.length}</span> of{' '}
            <span className="text-gray-900 font-bold">{profiles.length}</span> profiles
          </p>
        </div>

        {/* Profile Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg font-medium">No profiles found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileList;

