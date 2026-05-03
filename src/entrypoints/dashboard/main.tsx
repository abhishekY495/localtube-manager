import "~/assets/tailwind.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import Sidebar from "../content/App";
import Dashboard from "./dashboard";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <div
      className="h-screen bg-neutral-950 p-6 pb-16 text-white"
      style={{
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      <Dashboard />
      <Sidebar />
      <Toaster
        position="bottom-left"
        reverseOrder={true}
        containerStyle={{
          zIndex: 2147483647,
        }}
      />
    </div>
  </React.StrictMode>,
);
