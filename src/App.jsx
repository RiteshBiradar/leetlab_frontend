import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing.jsx';
import ProblemsPage from './pages/ProblemsPage.jsx';
import ProblemDetail from './pages/ProblemDetail.jsx';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/Signup.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import UserProfile from './pages/UserProfile.jsx'
import AdminCreateProblem from './pages/AdminCreateProblem.jsx';
import CreatePlaylist from './pages/CreatePlaylist.jsx';
import ViewPlaylists from './pages/ViewPlaylist.jsx';
export default function App() {
  return (
    <AuthProvider>
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:title" element={<ProblemDetail />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/create-problem" element={<AdminCreateProblem />} />
        <Route path='/create-playlist' element={<CreatePlaylist/>}/>
        <Route path='/view-playlists' element ={<ViewPlaylists/>}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
}