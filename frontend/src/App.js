import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import { useAuth } from "./context/AuthProvider";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import CreateElectionPage from "./components/CreateElectionPage";
import CreateElection from "./components/CreateElection.jsx";
import { DataTable } from "./components/data-table";
import { AppSidebar } from "./components/app-sidebar";
import { ElectionBallotPage } from "./pages/ElectionBallotPage";
import Page from "./app/dashboard/Page";

// Main App Component
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/dash"
          element={
            user.type === "admin" ? <Page /> : <StudentDashboard />
          }
        />
        <Route
          path="/"
          element={
            user.type === "admin" ? <AdminDashboard /> : <StudentDashboard />
          }
        />
        <Route
          path="/ballot"
          element={
            user.type === "student" ? (
              <ElectionBallotPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/election/create"
          element={
            user.type === "admin" ? <CreateElectionPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/create-test"
          element={
            user.type === "admin" ? <CreateElection /> : <Navigate to="/" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
