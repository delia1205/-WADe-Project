import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QueryPage from "./pages/QueryPage";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TutorialPage from "./pages/TutorialPage";
import UserContextProvider from "./hooks/context";
import UserProfile from "./pages/UserProfile";
import SignInPage from "./pages/SignInPage";
import NotFound from "./pages/NotFound";
import PrivateRoutes from "./components/PrivateRoutes";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserContextProvider>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="tutorial" element={<TutorialPage />} />
              <Route path="sign-in" element={<SignInPage />} />
              <Route element={<PrivateRoutes />}>
                <Route path="query" element={<QueryPage />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="result" element={<ResultsPage />} />
              </Route>
            </Route>
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
