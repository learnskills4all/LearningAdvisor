import React from "react";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./app/store";
import client from "./app/client";

// Define the rootElementt
const rootElement = document.getElementById("root");
// Check if there is an error that blocks React
if (!rootElement) throw new Error("Failed to find the root element");

// Define the root for the React application
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* Initialize the query provider tag at the root */}
    <QueryClientProvider client={client}>
      {/* Initialize the global variable store provider */}
      <Provider store={store}>
        {/* Initialize the client-side routing provider by React Router */}
        <BrowserRouter>
          {/* Render the application */}
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
