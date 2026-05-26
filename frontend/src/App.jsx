import { Routes, Route } from 'react-router-dom'
import './index.css'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyOtp from './pages/VerifyOtp'
import AuthCallback from './pages/AuthCallback'
import SearchResults from './pages/SearchResults'
import RecipeDetails from './pages/RecipeDetails'
import Profile from './pages/Profile'

const App = () => {
  return (
    <Routes>
      {/* Pages wrapped in global layout */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Direct routes (no global navbar/footer) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  )
}

export default App
