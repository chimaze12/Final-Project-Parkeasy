import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import NavBar from "./components/NavBar";

export const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <div
        style={{
          overflow: "hidden",
        }}
      >
        <NavBar />
        <Dashboard />
      </div>
    ),
  },
];
