import React, { useState } from "react";

const Admin = ({ shifts, onAddShift }) => {
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  const handleAdd = () => {
    if (!role || !date || !startTime || !endTime || !location) {
      alert("Please fill out all fields");
      return;
    }
    onAddShift({ role, date, startTime, endTime, location });
    setRole("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Shift Scheduling</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Add Shift
      </button>

      {/* Admin Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Role</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Volunteers</th>
          </tr>
        </thead>
        <tbody>
          {shifts.length === 0 ? (
            <tr>
              <td colSpan="6" className="border p-2 text-center">
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
