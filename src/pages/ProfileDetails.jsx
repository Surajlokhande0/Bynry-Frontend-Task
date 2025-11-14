import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProfiles } from '../context/ProfileContext';
import Map from '../components/Map';
import Loader from '../components/Loader';
import * as profileService from '../services/profileService';

const ProfileDetails = () => {
  const { id } = useParams();
  const { profiles } = useProfiles();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      // First try to get from context
      const contextProfile = profiles.find(p => p.id === parseInt(id));
      if (contextProfile) {
        setProfile(contextProfile);
        setLoading(false);
        return;
      }

      // If not in context, fetch from service
      try {
        setLoading(true);
        setError(null);
        const data = await profileService.getProfileById(id);
        if (!data) {
          setError('Profile not found');
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, profiles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-red-600 mb-6">{error || 'The profile you are looking for does not exist.'}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg"
          >
            Back to Profiles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profiles
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="md:flex">
            {/* Photo Section - Uniform size */}
            <div className="md:w-1/3 bg-gray-100">
              <div className="w-full h-80 md:h-full min-h-[400px] relative overflow-hidden">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                  }}
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-2/3 p-6 md:p-8 lg:p-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{profile.name}</h1>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{profile.fullDescription || profile.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address</h3>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-700">{profile.address}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact</h3>
                    <div className="space-y-2 text-gray-700">
                      {profile.contact?.email && (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{profile.contact.email}</span>
                        </div>
                      )}
                      {profile.contact?.phone && (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{profile.contact.phone}</span>
                        </div>
                      )}
                      {(!profile.contact?.email && !profile.contact?.phone) && (
                        <p className="text-gray-500 italic">No contact information available</p>
                      )}
                    </div>
                  </div>
                </div>

                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-full text-sm font-semibold border border-blue-200"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="p-6 md:p-8 lg:p-10 border-t border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Location
            </h2>
            <Map
              latitude={profile.latitude}
              longitude={profile.longitude}
              fullAddress={profile.address}
              className="h-[500px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;

