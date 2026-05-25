import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// Suppress MetaMask/Chrome Extension errors from triggering React's error overlay.
window.addEventListener('error', (e) => {
  const isExtensionError = 
    (e.filename && e.filename.indexOf('chrome-extension') > -1) ||
    (e.message && (e.message.includes('MetaMask') || e.message.includes('extension')));
  if (isExtensionError) {
    e.stopImmediatePropagation();
  }
}, true);

window.addEventListener('unhandledrejection', (e) => {
  const reason = e.reason;
  const isExtensionRejection = 
    reason && (
      (reason.stack && reason.stack.includes('chrome-extension')) ||
      (reason.message && (reason.message.includes('MetaMask') || reason.message.includes('extension')))
    );
  if (isExtensionRejection) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}, true);

// Suppress the benign "ResizeObserver loop" browser warning from React's error overlay.
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    super((entries, observer) => {
      window.requestAnimationFrame(() => {
        if (callback && typeof callback === 'function') {
          callback(entries, observer);
        }
      });
    });
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
