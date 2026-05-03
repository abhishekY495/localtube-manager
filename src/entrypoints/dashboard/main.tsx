import "~/assets/tailwind.css";
import React from "react";
import ReactDOM from "react-dom/client";
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
    </div>
  </React.StrictMode>,
);
