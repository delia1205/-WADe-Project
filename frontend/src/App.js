import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QueryPage from "./pages/QueryPage";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TutorialPage from "./pages/TutorialPage";
import UserContextProvider from "./hooks/context";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="query" element={<QueryPage />} />
              <Route path="tutorial" element={<TutorialPage />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </div>
  );
}

export default App;
