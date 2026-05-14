import "~/assets/tailwind.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <div className="h-screen bg-neutral-950 p-2 text-white font-sans">
      <App />
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
