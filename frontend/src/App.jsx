import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/auth/signup/SignupPage.jsx";
import LoginPage from "./pages/auth/login/LoginPage.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import SideBar from "./components/common/SideBar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        <SideBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
        <RightPanel />
        <Toaster />
      </div>
    </>
  );
}

export default App;
