import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfiles } from '../context/ProfileContext';
import Loader from '../components/Loader';

const AdminPanel = () => {
  const { profiles, loading, deleteProfile } = useProfiles();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteProfile(id);
    } catch (error) {
      alert('Error deleting profile: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
              <p className="text-gray-600">Manage profiles and user data</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 text-center"
              >
                View Profiles
              </Link>
              <Link
                to="/admin/add"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 text-center"
              >
                Add New Profile
              </Link>
            </div>
          </div>
        </div>

        {loading && !profiles.length ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm">
            <div className="text-center">
              <Loader size="lg" />
              <p className="mt-4 text-gray-600 font-medium">Loading profiles...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profiles.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <p className="text-gray-600 font-medium text-lg mb-2">No profiles found</p>
                          <p className="text-gray-500 text-sm mb-4">Add your first profile to get started!</p>
                          <Link
                            to="/admin/add"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            Add Profile
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    profiles.map((profile) => (
                      <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={profile.photo}
                              alt={profile.name}
                              className="w-full h-full object-cover object-center"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{profile.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{profile.city}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                            {profile.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(profile.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(profile.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={loading || deletingId === profile.id}
                            >
                              {deletingId === profile.id ? (
                                <Loader size="sm" />
                              ) : (
                                'Delete'
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

