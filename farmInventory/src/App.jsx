import React from "react";
import Login from "./Features/Login";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Dasboard from "./Pages/Dashboard";
import Signup from "./Pages/Signup";

const App = () => {
  const router = createHashRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dasboard />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);
  return (
    <div
      className="h-screen  "
      style={{
        background:
          "linear-gradient(rgba(255,255,255,0.83),rgba(255,255,255,0.9)),URL('logo.jpeg') no-repeat center/contain,#f0f0f0",
      }}
    >
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
