import React, { useState } from "react";

const Volunteer = ({ shifts, fetchShifts, user }) => {
  const [message, setMessage] = useState("");

  const handleClick = async (shift) => {
    if (!user) {
      alert("You must be logged in to sign up.");
      return;
    }

    const isSignedUp = shift.volunteers.some(v => v.email === user.email);
    const url = `http://localhost:4000/shifts/${shift.id}/volunteer`;
    const method = isSignedUp ? "DELETE" : "POST";
    const body = JSON.stringify({ name: user.name, email: user.email });

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update signup");
      }

      const action = isSignedUp ? "un-signed from" : "signed up for";
      setMessage(`You have ${action} "${shift.role}" successfully!`);
      fetchShifts(); // refresh table
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to update signup due to network error.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Volunteer Sign Up</h1>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>}

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Role</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Volunteers</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {shifts.length === 0 ? (
            <tr>
              <td colSpan="5" className="border p-2 text-center">
                No shifts available yet.
              </td>
            </tr>
          ) : (
            shifts.map(shift => {
              const isSignedUp = shift.volunteers.some(v => v.email === user.email);
              return (
                <tr key={shift.id}>
                  <td className="border p-2">{shift.role}</td>
                  <td className="border p-2">{shift.startTime}</td>
                  <td className="border p-2">{shift.endTime}</td>
                  <td className="border p-2">
                    {shift.volunteers.length > 0
                      ? shift.volunteers.map(v => `${v.name} (${v.email})`).join(", ")
                      : "—"}
                  </td>
                  <td className="border p-2">
                    <button
                      className={`px-3 py-1 rounded text-white ${isSignedUp ? "bg-red-500" : "bg-green-500"}`}
                      onClick={() => handleClick(shift)}
                    >
                      {isSignedUp ? "Un-sign Up" : "Sign Up"}
                    </button>
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
