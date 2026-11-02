import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Account from "./pages/Account";
import { Route, Routes } from "react-router-dom";
import CreateReport from "./pages/CreateReport";
import ProtectedRoute from "./components/ProtectedRoute";
import { useLocation } from "react-router-dom";
import MyReports from "./pages/MyReports";
import ReportDetails from "./pages/ReportDetails";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import "./App.css";
function App() {
  const location = useLocation();
  const showNavbar =
    !["/login", "/register"].includes(location.pathname) &&
    Boolean(localStorage.getItem("JWT"));
  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician-dashboard"
          element={
            <ProtectedRoute>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/new"
          element={
            <ProtectedRoute>
              <CreateReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:id"
          element={
            <ProtectedRoute>
              <ReportDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
export default App;
