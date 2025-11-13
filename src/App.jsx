import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AudioProvider } from './contexts/AudioContext';
import { HeritageProvider } from './contexts/HeritageContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Repository from './pages/Repository';
import Community from './pages/Community';
import GalleryPage from './pages/Gallery';
import Admin from './pages/Admin';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <HeritageProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cursos" element={<Courses />} />
                <Route path="/patrimonio" element={<Repository />} />
                <Route path="/comunidad" element={<Community />} />
                <Route path="/galeria" element={<GalleryPage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/perfil" element={<UserProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Layout>
          </Router>
        </HeritageProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;