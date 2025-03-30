import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { persistor, store } from "./store/redux";
import App from "./App";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, createBrowserRouter, Navigate } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { ChatbotDetails } from "pages/publics";

const container = document.getElementById("root");
const root = createRoot(container);

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         index: true,
//         element: <Navigate to="/chat/info" />,
//       },
//       {
//         path: "/chat/info",
//         element: <ChatbotDetails />,
//       },
//       {
//         path: "/chat/:id",
//         element: <ChatbotDetails />,
//       },
//     ],
//   },
// ]);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);