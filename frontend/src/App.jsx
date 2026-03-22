import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import Chatbot from './components/Chatbot'
import WhatsAppButton from './components/WhatsAppButton'

export default function App() {
  return (
    <div className="mesh-bg min-h-screen">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/*" element={
          <>
            <Navbar />
            <Home />
            <Chatbot />
            <WhatsAppButton />
          </>
        } />
      </Routes>
    </div>
  )
}
