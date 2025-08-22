import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"; // Import useLocation
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedTrainerRoute from "./components/ProtectedTrainerRoute";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import WorkoutsPage from "./Pages/WorkoutsPage";
import CreateWorkoutPage from "./Pages/CreateWorkoutPage";
import LiveWorkoutPage from "./Pages/LiveWorkoutPage";
import HistoryPage from "./Pages/HistoryPage";
import TrainerRegisterPage from "./Pages/TrainerRegisterPage";
import TrainerLoginPage from "./Pages/TrainerLoginPage";
import TrainerDashboardPage from "./Pages/TrainerDashboardPage";
import TrainerWorkoutsPage from "./Pages/TrainerWorkoutsPage";
import TrainerCreateWorkoutPage from "./Pages/TrainerCreateWorkoutPage";
import ClientDetailsPage from "./Pages/ClientDetailsPage";
import OnboardingPage from "./Pages/OnboardingPage";
import ProfilePage from "./Pages/ProfilePage";
import EditWorkoutPage from "./Pages/EditWorkoutPage";
import TrainerEditWorkoutPage from "./Pages/TrainerEditWorkoutPage";
import TrainerProfilePage from "./Pages/TrainerProfilePage";

// --- IMPORT THE NEW PAGES ---
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";
import TermsOfServicePage from "./Pages/TermsOfServicePage";

// A new component to handle the main layout
const MainLayout = () => {
  const location = useLocation();
  // Paths where the footer should be hidden
  const footerHiddenPaths = [
    "/login",
    "/register",
    "/trainer/login",
    "/trainer/register",
  ];
  const shouldShowFooter = !footerHiddenPaths.includes(location.pathname);

  return (
    <div className="bg-bg-default text-text-primary min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/trainer/register" element={<TrainerRegisterPage />} />
          <Route path="/trainer/login" element={<TrainerLoginPage />} />
          {/* --- ADD NEW STATIC ROUTES --- */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          {/* Protected Athlete Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/create-workout" element={<CreateWorkoutPage />} />
            <Route path="/workout/:id" element={<LiveWorkoutPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-workout/:id" element={<EditWorkoutPage />} />
          </Route>

          {/* Protected Trainer Routes */}
          <Route element={<ProtectedTrainerRoute />}>
            <Route
              path="/trainer/dashboard"
              element={<TrainerDashboardPage />}
            />
            <Route path="/trainer/workouts" element={<TrainerWorkoutsPage />} />
            <Route
              path="/trainer/create-workout"
              element={<TrainerCreateWorkoutPage />}
            />
            <Route
              path="/trainer/edit-workout/:id"
              element={<TrainerEditWorkoutPage />}
            />
            <Route
              path="/trainer/client/:clientId"
              element={<ClientDetailsPage />}
            />
            <Route path="/trainer/profile" element={<TrainerProfilePage />} />
          </Route>
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

// The main App component now just renders the Router and the MainLayout
function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
