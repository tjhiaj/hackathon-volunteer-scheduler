import React, { useState } from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Volunteer from "./pages/Volunteer";

function App() {
  const [tab, setTab] = useState("home");
  const [shifts, setShifts] = useState([]);

  const handleSignUp = (shiftIdx, volunteer) => {
    if (!volunteer.name || !volunteer.email) {
      alert("Please enter your name and email before signing up.");
      return;
    }
    const updated = [...shifts];
    updated[shiftIdx].volunteers.push(volunteer);
    setShifts(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={() => setTab("home")} className={tab === "home" ? "font-bold" : ""}>
          Home
        </button>
        <button onClick={() => setTab("admin")} className={tab === "admin" ? "font-bold" : ""}>
          Admin
        </button>
        <button onClick={() => setTab("volunteer")} className={tab === "volunteer" ? "font-bold" : ""}>
          Volunteer
        </button>
      </div>

      {/* Page Content */}
      {tab === "home" && <Home />}
      {tab === "admin" && <Admin shifts={shifts} setShifts={setShifts} />}
      {tab === "volunteer" && <Volunteer shifts={shifts} handleSignUp={handleSignUp} />}
    </div>
  );
}

export default App;
