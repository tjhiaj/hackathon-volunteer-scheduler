import React, { useState, useEffect } from "react";
import Admin from "./pages/Admin";
import Volunteer from "./pages/Volunteer";
import Home from "./pages/Home";
import ScheduleTable from "./components/ScheduleTable";

function App() {
  const [tab, setTab] = useState("home");
  const [shifts, setShifts] = useState([]);

  // Fetch shifts from backend
  const fetchShifts = async () => {
    try {
      const res = await fetch("http://localhost:4000/shifts");
      const data = await res.json();
      setShifts(data);
    } catch (err) {
      console.error("Failed to fetch shifts", err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={() => setTab("home")} className={tab === "home" ? "font-bold" : ""}>Home</button>
        <button onClick={() => setTab("admin")} className={tab === "admin" ? "font-bold" : ""}>Admin</button>
        <button onClick={() => setTab("volunteer")} className={tab === "volunteer" ? "font-bold" : ""}>Volunteer</button>
      </div>

      {/* Pages */}
      {tab === "home" && <Home />}
      {tab === "admin" && <Admin shifts={shifts} refreshShifts={fetchShifts} />}
      {tab === "volunteer" && <Volunteer shifts={shifts} refreshShifts={fetchShifts} />}
    </div>
  );
}

export default App;
