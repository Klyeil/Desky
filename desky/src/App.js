import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CommunityListPage from './pages/CommunityListPage';
import PostCreationPage from './pages/PostcreationPage';
import FeedPage from './pages/FeedPage';
import FeedUpload from './pages/FeedUpload';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import ConsultingPage from './pages/\bConsultingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/community" element={<CommunityListPage />} />
            <Route path="/community/post" element={<PostCreationPage />} />
            <Route path="/desk" element={<FeedPage />} />
            <Route path="/desk/upload" element={<FeedUpload />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/consult" element={<ConsultingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;