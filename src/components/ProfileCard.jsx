import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapModal from './MapModal';

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();
  const [showMapModal, setShowMapModal] = useState(false);

  const handleViewDetails = () => {
    navigate(`/profile/${profile.id}`);
  };

  const handleSummary = () => {
    setShowMapModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
        {/* Image Container - Uniform size with proper cropping */}
        <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
          />
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{profile.name}</h3>
          <p className="text-gray-600 text-sm mb-5 line-clamp-2 min-h-[2.5rem]">{profile.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleSummary}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Summary
            </button>
            <button
              onClick={handleViewDetails}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-semibold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {showMapModal && (
        <MapModal
          isOpen={showMapModal}
          onClose={() => setShowMapModal(false)}
          latitude={profile.latitude}
          longitude={profile.longitude}
          fullAddress={profile.address}
          profileName={profile.name}
        />
      )}
    </>
  );
};

export default ProfileCard;

