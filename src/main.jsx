import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Web3ModalProvider } from "./providers/Web3ModalProivder.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Web3ModalProvider>
            <App />
        </Web3ModalProvider>
    </React.StrictMode>
);
