import React, { useState } from "react";
import Admin from "./pages/Admin";
import Volunteer from "./pages/Volunteer";
import Home from "./pages/Home";

function App() {
  const [tab, setTab] = useState("home");
  const [shifts, setShifts] = useState([]);

  // Add new shift from Admin
  const handleAddShift = (newShift) => {
    setShifts((prev) => [...prev, { ...newShift, volunteers: [] }]);
  };

  // Volunteer sign-up
  const handleSignUp = (shiftIdx, volunteer) => {
    if (!volunteer.name || !volunteer.email) {
      alert("Please enter your name and email first.");
      return;
    }
    setShifts((prevShifts) =>
      prevShifts.map((shift, idx) =>
        idx === shiftIdx
          ? { ...shift, volunteers: [...shift.volunteers, volunteer] }
          : shift
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setTab("home")}
          className={tab === "home" ? "font-bold" : ""}
        >
          Home
        </button>
        <button
          onClick={() => setTab("admin")}
          className={tab === "admin" ? "font-bold" : ""}
        >
          Admin
        </button>
        <button
          onClick={() => setTab("volunteer")}
          className={tab === "volunteer" ? "font-bold" : ""}
        >
          Volunteer
        </button>
      </div>

      {/* Pages */}
      {tab === "home" && <Home />}
      {tab === "admin" && <Admin shifts={shifts} onAddShift={handleAddShift} />}
      {tab === "volunteer" && (
        <Volunteer shifts={shifts} onSignUp={handleSignUp} />
      )}
    </div>
  );
}

export default App;
