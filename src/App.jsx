import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "../src/Pages/DashBoard";
import Employees from "./pages/Employees";

import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
                   <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
             <Route path="/employees" element={<Employees />} />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
