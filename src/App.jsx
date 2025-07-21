import './App.css'
import {Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import GroupSelectorPage from './pages/GroupSelectorPage';
import OverviewPage from './pages/OverviewPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot' element={<ForgotPasswordPage />} />
        <Route path='/groupSelector' element={<GroupSelectorPage />} />
        <Route path='/overview' element={<OverviewPage />} />
      </Routes>
    </>
  )
}

export default App
