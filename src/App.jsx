import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InfluencerDashboard from './pages/InfluencerDashboard';
import NPODashboard from './pages/NPODashboard';
import AdminDashboard from './pages/AdminDashboard';
import GoRedirect from './pages/GoRedirect';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/influencer" replace />} />
        <Route path="/influencer/*" element={<InfluencerDashboard />} />
        <Route path="/npo/*" element={<NPODashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/go/:slug" element={<GoRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
