import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout.tsx";

import LoginFormPage from "./pages/LoginFormPage";
import RegisterPage from "./pages/RegisterPage";
import SetPasswordPage from "./pages/SetPasswordPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import MainAppPage from "./pages/MainAppPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerificationPage from "./pages/VerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ExistPage from "./pages/ExistPage";
import NoCongregationPage from "./pages/NoCongregationPage";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div>
    <title>{title}</title>
    <h1 className="text-2xl p-8">This is the {title} page.</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LoginFormPage />} />
          <Route path="loginform" element={<LoginFormPage />} />
          <Route path="registerng" element={<RegisterPage />} />
          <Route path="setpass" element={<SetPasswordPage />} />
          <Route path="auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="forgot" element={<ForgotPasswordPage />} />
          <Route path="verification" element={<VerificationPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="withcong" element={<PlaceholderPage title="With Congregation" />} />
          <Route path="withoutcong" element={<PlaceholderPage title="Without Congregation" />} />
          <Route path="returning" element={<PlaceholderPage title="Returning User" />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="App_page" element={<MainAppPage />} />
            <Route path="complete-profile" element={<CompleteProfilePage />} />
            <Route path="exist" element={<ExistPage />} />
            <Route path="nocong" element={<NoCongregationPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
