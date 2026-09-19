import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/core/components/layout/AppLayout'
import { Dashboard } from '@/core/pages/Dashboard'
import { Onboarding } from '@/core/pages/Onboarding'
import { Checkout } from '@/core/pages/Checkout'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
