import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginPage from './LoginPage.jsx'
import HomePage from './HomePage.jsx'
import RegisterPage from './ResgisterPage.jsx'
import ChangePageProject from './ProjectPageChat.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home"element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/project/:projectId" element={<ChangePageProject />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
