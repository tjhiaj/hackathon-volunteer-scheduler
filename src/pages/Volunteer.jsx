// Volunteer.jsx
import React, { useState } from "react";
import ScheduleTable from "../components/ScheduleTable";

const Volunteer = ({ shifts, fetchShifts, user }) => {
  const [message, setMessage] = useState("");

  const handleSignUp = async (shiftId) => {
    try {
      const res = await fetch(`http://localhost:4000/shifts/${shiftId}/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, email: user.email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to sign up");
      }

      await fetchShifts();
      setMessage("You have signed up successfully!");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || "Network error: could not sign up.");
    }
  };

  const handleUnsignUp = async (shiftId) => {
    try {
      const res = await fetch(`http://localhost:4000/shifts/${shiftId}/volunteer`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, email: user.email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to un-sign up");
      }

      await fetchShifts();
      setMessage("You have un-signed successfully!");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || "Network error: could not un-sign.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Volunteer Sign Up</h1>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}

      <ScheduleTable
        shifts={shifts}
        mode="volunteer"
        userEmail={user?.email}
        onSignUp={handleSignUp}
        onUnsignUp={handleUnsignUp}
      />
    </div>
  );
};

export default Volunteer;
