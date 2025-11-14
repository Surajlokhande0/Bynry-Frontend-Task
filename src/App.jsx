import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import ProfileList from './pages/ProfileList';
import ProfileDetails from './pages/ProfileDetails';
import AdminPanel from './pages/AdminPanel';
import AddProfile from './pages/AddProfile';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <ProfileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProfileList />} />
          <Route path="/profile/:id" element={<ProfileDetails />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/add" element={<AddProfile />} />
          <Route path="/admin/edit/:id" element={<EditProfile />} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
}

export default App;

