import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import UserProvider, { UserContext } from "./context/userContext";

function App() {
  return (
    <>
      <UserProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Admin Routes */}
              <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/tasks" element={<ManageTasks />} />
                <Route
                  path="/admin/create-task/:taskId?"
                  element={<CreateTask />}
                />
                <Route path="/admin/users" element={<ManageUsers />} />
              </Route>

              {/* User Routes */}
              <Route element={<PrivateRoute allowedRoles={["user"]} />}>
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/my-tasks" element={<MyTasks />} />
                <Route
                  path="/user/task-details/:taskId"
                  element={<ViewTaskDetails />}
                />
              </Route>

              {/* Default Route */}
              <Route path="/" element={<Root />} />
            </Routes>
          </Router>
        </div>

        <Toaster
          toastOptions={{ className: "", style: { fontSize: "13px" } }}
        />
      </UserProvider>
    </>
  );
}

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
