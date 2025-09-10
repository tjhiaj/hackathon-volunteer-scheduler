import React, { useState } from "react";
import ScheduleTable from "../components/ScheduleTable";

const Admin = ({ shifts, setShifts }) => { // Accept setShifts directly
  const [editingShift, setEditingShift] = useState(null);
  const [form, setForm] = useState({
    role: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  // Add shift
  const handleAddShift = async () => {
    try {
      const res = await fetch("http://localhost:4000/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        return alert(data.error || "Failed to add shift");
      }

      const newShift = await res.json();
      setShifts((prev) => [...prev, newShift]); // Add new shift locally
      setForm({ role: "", date: "", startTime: "", endTime: "", location: "" });
    } catch (err) {
      console.error(err);
      alert("Network error while adding shift");
    }
  };

  // Edit shift
  const handleEditShift = async () => {
    try {
      const res = await fetch(`http://localhost:4000/shifts/${editingShift.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        return alert(data.error || "Failed to update shift");
      }

      const updatedShift = await res.json();

      // Update local shifts state immediately
      setShifts((prev) =>
        prev.map((s) => (s.id === updatedShift.id ? updatedShift : s))
      );

      setEditingShift(null);
      setForm({ role: "", date: "", startTime: "", endTime: "", location: "" });
    } catch (err) {
      console.error(err);
      alert("Network error while editing shift");
    }
  };

  // Delete shift
  const handleDeleteShift = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/shifts/${id}`, { method: "DELETE" });
      if (!res.ok) return alert("Failed to delete shift");

      setShifts((prev) => prev.filter((s) => s.id !== id)); // Remove locally
    } catch (err) {
      console.error(err);
      alert("Network error while deleting shift");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Add/Edit Shift Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="time"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="time"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={editingShift ? handleEditShift : handleAddShift}
      >
        {editingShift ? "Save Changes" : "Add Shift"}
      </button>
      {editingShift && (
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingShift(null);
            setForm({ role: "", date: "", startTime: "", endTime: "", location: "" });
          }}
        >
          Cancel
        </button>
      )}

      {/* Schedule Table */}
      <ScheduleTable
        shifts={shifts}
        mode="admin"
        onEdit={(shift) => {
          setEditingShift(shift);
          setForm({
            role: shift.role,
            date: shift.date,
            startTime: shift.startTime,
            endTime: shift.endTime,
            location: shift.location,
          });
        }}
        onDelete={handleDeleteShift}
      />
    </div>
  );
};

export default Admin;
