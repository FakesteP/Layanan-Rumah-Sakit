import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/loginPage";
import RegisterForm from "./components/registerPage";
import DashboardPage from "./components/dashboardPage";
import PrivateRoute from "./components/privateRoute";
import LayananDetail from "./pages/layananDetail";
import AdminLayanan from "./admin/adminLayanan";
import AdminPage from "./admin/AdminPage";
import AntrianForm from "./components/antrianForm";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import HistoryPage from "./pages/HistoryPage"; // pastikan path-nya sesuai


function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirect ke /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/layanan/:id" element={<LayananDetail />} />
        <Route
          path="/admin/layanan"
          element={
            <PrivateRoute>
              <AdminLayanan />
            </PrivateRoute>
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/antrian/form" element={<AntrianForm />} />
         <Route
        path="/profil"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
        <Route
          path="/profil/edit"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profil/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        {/* Route fallback untuk halaman tidak ditemukan */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
