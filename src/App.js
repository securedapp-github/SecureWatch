import "./output.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import Login1 from "./components/login1.jsx";
import Verify from "./components/verify.jsx";
import Home from "./components/home.jsx";
import Dashboard from "./components/dashboard.jsx";
import Monitor from "./components/monitor.jsx";
import MonitorActivity from "./components/monitor_activity.jsx";
import MonitorCreate from "./components/monitor_create.jsx";
import MonitorEdit from "./components/monitor_Edit.jsx";
import Events from "./components/events.jsx";
import SolEvents from "./components/sol_events.jsx";
import EventsEdit from "./components/event_Edit.jsx";
import AlertsEdit from "./components/alerts_Edit.jsx";
import Functions from "./components/functions.jsx";
import Alerts from "./components/alerts.jsx";
import Logs from "./components/logs.jsx";
import Emailverify from "./components/Emailverify.jsx";
import Protected from "./protected.js";
import ApiBuilder from "./components/api_builder.jsx";
import MonitorAlerts from "./components/monitor_alerts.jsx";
import Forgotpassword from "./components/Forgotpassword.jsx";
import Otpverify from "./components/Otpverify.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log" element={<Logs />} />
        <Route path="/alerts" element={<Protected cmp={<Alerts />} />} />
        <Route path="/function" element={<Protected cmp={<Functions />} />} />
        <Route path="/event" element={<Protected cmp={<Events />} />} />
        <Route path="/solevent" element={<Protected cmp={<SolEvents />} />} />
        <Route path="/alert_edit" element={<Protected cmp={<AlertsEdit />} />}/>
        <Route path="/event_edit" element={<Protected cmp={<EventsEdit />} />}/>
        <Route path="/monitor_create" element={<Protected cmp={<MonitorCreate />} />}/>
        <Route path="/monitor_Edit" element={<MonitorEdit />}></Route>
        <Route path="/monitor_activity" element={<Protected cmp={<MonitorActivity />} />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/otp" element={<Otpverify />} />
        <Route path="/login1" element={<Login1 />} />
        <Route path="/emailverify" element={<Emailverify />} />
        <Route path="verify" element={<Verify />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Protected cmp={<Dashboard />} />} />
        <Route path="/monitor" element={<Protected cmp={<Monitor />} />} />
        <Route path="/api_builder" element={<Protected cmp={<ApiBuilder />} />}/>
        <Route path="/monitor_alerts" element={<MonitorAlerts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
