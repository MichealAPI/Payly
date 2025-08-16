import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import GroupSelectorPage from "./pages/GroupSelectorPage";
import OverviewPage from "./pages/OverviewPage";
import Spinner from "./components/ui/Spinner/Spinner";
import LayoutWithSidebar from "./components/ui/Layout/LayoutWithSidebar";
import SettingsPage from "./pages/SettingsPage";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus } from "./features/auth/authSlice";
import { useEffect } from "react";


const ProtectedRoute = ({ children }) => {
  const { error, isAuthenticated, isLoading } = useSelector((state) => state.auth) || {};

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner />;
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />

        {/* Protected Routes with Sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <LayoutWithSidebar />
            </ProtectedRoute>
          }
        >
          <Route path="/groups" element={<GroupSelectorPage />} />
          <Route path="/overview/:groupId" element={<OverviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
