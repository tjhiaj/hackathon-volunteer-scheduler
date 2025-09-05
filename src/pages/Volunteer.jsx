import React, { useState } from "react";

const Volunteer = ({ shifts, onSignUp }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Volunteer Sign Up</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
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

      {/* Volunteer Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Role</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
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
            shifts.map((shift, idx) => (
              <tr key={idx}>
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
                  <button
                    onClick={() => onSignUp(idx, { name, email })}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Sign Up
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Volunteer;
