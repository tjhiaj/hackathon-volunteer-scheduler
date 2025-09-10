import React, { useState } from "react";

const Volunteer = ({ shifts, refreshShifts }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUpClick = async (shiftId, role) => {
    if (!name || !email) {
      alert("Please enter your name and email first.");
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

  const handleUnsignUpClick = async (shiftId, role) => {
    if (!name || !email) {
      alert("Please enter your name and email first.");
      return;
    }

    const res = await fetch(`http://localhost:4000/shifts/${shiftId}/volunteer`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Failed to un-signup.");
    } else {
      setMessage(`You have un-signed from "${role}" successfully!`);
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
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}

      {/* Shifts Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Role</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Volunteers</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {shifts.length === 0 ? (
            <tr>
              <td colSpan="7" className="border p-2 text-center">
                No shifts available yet.
              </td>
            </tr>
          ) : (
            shifts.map((shift) => {
              const alreadySignedUp = shift.volunteers.some(
                (v) => v.email === email && v.name === name
              );

              return (
                <tr key={shift.id}>
                  <td className="border p-2">{shift.role}</td>
                  <td className="border p-2">{shift.date}</td>
                  <td className="border p-2">{shift.startTime}</td>
                  <td className="border p-2">{shift.endTime}</td>
                  <td className="border p-2">{shift.location}</td>
                  <td className="border p-2">
                    {shift.volunteers.length > 0
                      ? shift.volunteers
                          .map((v) => `${v.name} (${v.email})`)
                          .join(", ")
                      : "—"}
                  </td>
                  <td className="border p-2">
                    {alreadySignedUp ? (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleUnsignUpClick(shift.id, shift.role)}
                      >
                        Un-signup
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => handleSignUpClick(shift.id, shift.role)}
                      >
                        Sign Up
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Volunteer;
