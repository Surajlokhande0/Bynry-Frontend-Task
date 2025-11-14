# Profile Viewer + Interactive Map App

A complete React.js application for viewing profiles with interactive maps, search/filter functionality, and admin CRUD operations.

## Features

- ✅ Profile List Page with grid layout
- ✅ Interactive Map Component (Mapbox integration)
- ✅ Summary button with map popup
- ✅ Admin Panel with full CRUD operations
- ✅ Search & Filter functionality
- ✅ Profile Details Page
- ✅ Responsive Design (Desktop, Tablet, Mobile)
- ✅ Error Handling
- ✅ Loading Indicators
- ✅ Form Validations

## Tech Stack

- React.js 18
- React Router v6
- Context API for state management
- TailwindCSS for styling
- Mapbox GL JS for maps
- LocalStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Mapbox token (optional but recommended):
   - Get a free token from [Mapbox](https://account.mapbox.com/)
   - Create a `.env` file in the root directory:
   ```
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```
   - Note: The app will work with a demo token, but for production use your own token.

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
  components/
    ProfileCard.jsx    # Profile card component
    Map.jsx            # Interactive map component
    Loader.jsx         # Loading spinner
  pages/
    ProfileList.jsx    # Main profiles listing page
    ProfileDetails.jsx # Individual profile details
    AdminPanel.jsx     # Admin dashboard
    AddProfile.jsx     # Add new profile form
    EditProfile.jsx    # Edit profile form
  context/
    ProfileContext.jsx # Global state management
  services/
    profileService.js  # Data service layer
  data/
    profiles.json      # Initial dummy data
  utils/
    helpers.js         # Utility functions
  App.jsx              # Main app component with routes
  main.jsx             # Entry point
```

## Usage

### Viewing Profiles

- Navigate to the home page to see all profiles
- Use the search box to filter by name
- Use the city filter dropdown to filter by location
- Click "Summary" to see a map with the profile location
- Click "View Details" to see full profile information

### Admin Panel

- Click "Admin Panel" button to access admin features
- Add new profiles with the "Add New Profile" button
- Edit existing profiles by clicking "Edit"
- Delete profiles by clicking "Delete" (with confirmation)

### Map Integration

The app uses Mapbox GL JS for interactive maps. Each profile has latitude and longitude coordinates that are displayed on the map.

## Data Storage

Profiles are stored in browser localStorage. The initial data is loaded from `src/data/profiles.json`.

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Notes

- The app uses localStorage for data persistence, so data will persist across browser sessions
- Mapbox token is optional - the app includes a demo token, but you should use your own for production
- All form fields with asterisks (*) are required
- The app is fully responsive and works on all device sizes

"# Bynry-Frontend-Task" 
