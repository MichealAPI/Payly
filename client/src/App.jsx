import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import GroupSelectorPage from './pages/GroupSelectorPage';
import OverviewPage from './pages/OverviewPage';
import { useAuth } from './context/AuthContext';
import Spinner from './components/ui/Spinner/Spinner';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  useAuth();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot' element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route 
          path='/groups' 
          element={
            <ProtectedRoute>
              <GroupSelectorPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/overview' 
          element={
            <ProtectedRoute>
              <OverviewPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
