import React, { useState } from "react";
import ScheduleTable from "../components/ScheduleTable";

const Volunteer = ({ shifts, refreshShifts }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUpClick = async (shiftId, role) => {
    if (!name || !email) {
      alert("Please enter your name and email first.");
      return;
    }

    const alreadySignedUp = shifts.find(s => s.id === shiftId)?.volunteers.some(v => v.email === email);
    if (alreadySignedUp) {
      setMessage(`You have already signed up for "${role}".`);
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    const res = await fetch(`http://localhost:4000/shifts/${shiftId}/volunteer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Failed to sign up.");
    } else {
      setMessage(`You have signed up for "${role}" successfully!`);
    }

    setTimeout(() => setMessage(""), 4000);
    refreshShifts();
  };

  const handleUnsignUpClick = async (shiftId) => {
    if (!email) {
      alert("Enter your email first to un-sign.");
      return;
    }

    const res = await fetch(`http://localhost:4000/shifts/${shiftId}/volunteer`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Failed to un-sign.");
    } else {
      setMessage("You have un-signed successfully.");
    }

    setTimeout(() => setMessage(""), 4000);
    refreshShifts();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Volunteer Sign Up</h1>

      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded w-full" />
        </div>
      </div>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>}

      {/* Schedule Table with filtering */}
      <ScheduleTable
        shifts={shifts}
        mode="volunteer"
        onSignUp={handleSignUpClick}
        onUnsignUp={handleUnsignUpClick}
        userEmail={email}
      />
    </div>
  );
};

export default Volunteer;
