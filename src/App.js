import "./output.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import Login1 from "./components/login1.jsx";
import Verify from "./components/verify.jsx";
import Home from "./components/home.jsx";
import Dashboard from "./components/dashboard.jsx";
import Monitor from "./components/monitor.jsx";
import Monitor_activity from "./components/monitor_activity.jsx";
import Monitor_create from "./components/monitor_create.jsx";
import Events from "./components/events.jsx";
import Functions from "./components/functions.jsx";
import Alerts from "./components/alerts.jsx";
import Logs from "./components/logs.jsx";
import Emailverify from "./components/Emailverify.jsx";
import Protected from "./protected.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log" element={<Logs />} />
        <Route path="/alerts" element={<Protected cmp={<Alerts />} />} />
        <Route path="/function" element={<Protected cmp={<Functions />} />} />
        <Route path="/event" element={<Protected cmp={<Events />} />} />
        <Route
          path="/monitor_create"
          element={<Protected cmp={<Monitor_create />} />}
        />
        <Route
          path="/monitor_activity"
          element={<Protected cmp={<Monitor_activity />} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login1" element={<Login1 />} />
        <Route path="/emailverify" element={<Emailverify />} />
        <Route path="verify" element={<Verify />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Protected cmp={<Dashboard />} />} />
        <Route path="/monitor" element={<Protected cmp={<Monitor />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
