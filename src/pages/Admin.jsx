import React, { useState } from "react";

const Admin = ({ shifts, refreshShifts }) => {
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [editingShift, setEditingShift] = useState(null);

  const handleAddShift = async () => {
    if (!role || !date || !startTime || !endTime || !location) {
      alert("Please fill out all fields");
      return;
    }

    const res = await fetch("http://localhost:4000/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, date, startTime, endTime, location }),
    });

    if (!res.ok) {
      alert("Failed to add shift");
      return;
    }

    setRole(""); setDate(""); setStartTime(""); setEndTime(""); setLocation("");
    refreshShifts();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin: Add Shifts</h1>

      {/* Add Shift Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-1">Role</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Start Time</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">End Time</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div className="flex items-end">
          <button onClick={handleAddShift} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Shift
          </button>
        </div>
      </div>

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
          </tr>
        </thead>
        <tbody>
          {shifts.length === 0 ? (
            <tr>
              <td colSpan="6" className="border p-2 text-center">No shifts available yet.</td>
            </tr>
          ) : (
            shifts.map((shift) => (
              <tr key={shift.id}>
                <td className="border p-2">{shift.role}</td>
                <td className="border p-2">{shift.date}</td>
                <td className="border p-2">{shift.startTime}</td>
                <td className="border p-2">{shift.endTime}</td>
                <td className="border p-2">{shift.location}</td>
                <td className="border p-2">
                  {shift.volunteers.length > 0
                    ? shift.volunteers.map(v => `${v.name} (${v.email})`).join(", ")
                    : "—"}
                </td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                    onClick={() => setEditingShift(shift)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingShift && (
        <form
          className="p-4 border rounded bg-gray-100 mt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const res = await fetch(`http://localhost:4000/shifts/${editingShift.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  role: editingShift.role,
                  date: editingShift.date,
                  startTime: editingShift.startTime,
                  endTime: editingShift.endTime,
                  location: editingShift.location,
                }),
              });

              const data = await res.json();
              if (!res.ok) {
                console.error("Update failed:", data);
                alert(data.error || "Failed to update shift");
                return;
              }

              // success: clear edit form and refresh table
              setEditingShift(null);
              await refreshShifts();
            } catch (err) {
              console.error("Error saving shift:", err);
              alert("An error occurred while saving. Check console.");
            }
          }}
        >
          <h2 className="font-bold mb-2">Edit Shift</h2>

          <label className="block font-semibold mb-1">Role</label>
          <input
            type="text"
            value={editingShift.role}
            onChange={(e) => setEditingShift({ ...editingShift, role: e.target.value })}
            className="border p-2 w-full mb-2"
          />

          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            value={editingShift.date}
            onChange={(e) => setEditingShift({ ...editingShift, date: e.target.value })}
            className="border p-2 w-full mb-2"
          />

          <label className="block font-semibold mb-1">Start Time</label>
          <input
            type="time"
            value={editingShift.startTime}
            onChange={(e) => setEditingShift({ ...editingShift, startTime: e.target.value })}
            className="border p-2 w-full mb-2"
          />

          <label className="block font-semibold mb-1">End Time</label>
          <input
            type="time"
            value={editingShift.endTime}
            onChange={(e) => setEditingShift({ ...editingShift, endTime: e.target.value })}
            className="border p-2 w-full mb-2"
          />

          <label className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            value={editingShift.location}
            onChange={(e) => setEditingShift({ ...editingShift, location: e.target.value })}
            className="border p-2 w-full mb-2"
          />

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save Changes</button>
            <button type="button" onClick={() => setEditingShift(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Admin;
