import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfiles } from '../context/ProfileContext';
import Loader from '../components/Loader';
import { validateEmail, validateURL } from '../utils/helpers';
import * as profileService from '../services/profileService';

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProfile, loading } = useProfiles();
  const [errors, setErrors] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    description: '',
    fullDescription: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    email: '',
    phone: '',
    interests: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const profile = await profileService.getProfileById(id);
        if (!profile) {
          navigate('/admin');
          return;
        }
        setFormData({
          name: profile.name || '',
          photo: profile.photo || '',
          description: profile.description || '',
          fullDescription: profile.fullDescription || '',
          address: profile.address || '',
          city: profile.city || '',
          latitude: profile.latitude?.toString() || '',
          longitude: profile.longitude?.toString() || '',
          email: profile.contact?.email || '',
          phone: profile.contact?.phone || '',
          interests: profile.interests?.join(', ') || '',
        });
      } catch (error) {
        alert('Error loading profile: ' + error.message);
        navigate('/admin');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.photo.trim()) {
      newErrors.photo = 'Photo URL is required';
    } else if (!validateURL(formData.photo)) {
      newErrors.photo = 'Please enter a valid URL';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.latitude.trim()) {
      newErrors.latitude = 'Latitude is required';
    } else if (isNaN(formData.latitude) || parseFloat(formData.latitude) < -90 || parseFloat(formData.latitude) > 90) {
      newErrors.latitude = 'Latitude must be a number between -90 and 90';
    }

    if (!formData.longitude.trim()) {
      newErrors.longitude = 'Longitude is required';
    } else if (isNaN(formData.longitude) || parseFloat(formData.longitude) < -180 || parseFloat(formData.longitude) > 180) {
      newErrors.longitude = 'Longitude must be a number between -180 and 180';
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const interestsArray = formData.interests
        ? formData.interests.split(',').map(i => i.trim()).filter(i => i)
        : [];

      const profile = {
        name: formData.name.trim(),
        photo: formData.photo.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim() || formData.description.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        latitude: formData.latitude.trim(),
        longitude: formData.longitude.trim(),
        contact: {
          email: formData.email.trim() || '',
          phone: formData.phone.trim() || '',
        },
        interests: interestsArray,
      };

      await updateProfile(id, profile);
      navigate('/admin');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 font-medium transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Admin Panel
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update profile information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.photo ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="40.7128"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.latitude ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                />
                {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="-74.0060"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.longitude ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                />
                {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interests (comma-separated)
              </label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Coding, Photography, Hiking"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader size="sm" /> : 'Update Profile'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

