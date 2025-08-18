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
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import DownloadPage from "./pages/DownloadPage";
import HelpPage from "./pages/HelpPage";
import ChangelogPage from "./pages/ChangelogPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiesPage from "./pages/CookiesPage";
import StatusPage from "./pages/StatusPage";
import SecurityPage from "./pages/SecurityPage";
import BrandPage from "./pages/BrandPage";
import InstallPrompt from "./components/pwa/InstallPrompt";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus } from "./features/auth/authSlice";
import './features/ui/themeSlice.js'
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

  const theme = useSelector((state) => state.theme?.theme ?? "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        {/* Marketing/Informational Routes */}
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/brand" element={<BrandPage />} />

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
  <InstallPrompt />
    </>
  );
}

export default App;
