import "~/assets/tailwind.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

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
      <App />
    </div>
  </React.StrictMode>,
);
