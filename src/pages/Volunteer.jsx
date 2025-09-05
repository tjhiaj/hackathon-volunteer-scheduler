import React, { useState } from "react";

const Volunteer = ({ shifts, handleSignUp }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Volunteer Sign-Up</h2>
      <div className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <h3 className="font-semibold mb-2">Available Shifts:</h3>
      <ul className="space-y-2">
        {shifts.map((shift, idx) => (
          <li key={idx} className="border p-2 rounded flex justify-between">
            <span>
              {shift.role} — {shift.date} {shift.startTime}–{shift.endTime} @{" "}
              {shift.location}
            </span>
            <button
              onClick={() => handleSignUp(idx, { name, email })}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Sign Up
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Volunteer;
