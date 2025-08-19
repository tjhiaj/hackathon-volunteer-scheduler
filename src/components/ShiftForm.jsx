import React, { useState } from "react";

function ShiftForm({ onAddShift }) {
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role || !date || !startTime || !endTime || !location) return;

    onAddShift({ role, date, startTime, endTime, location });
    setRole("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md space-y-4 max-w-md"
    >
      <h2 className="text-xl font-bold mb-2">Add Shift</h2>
      
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full border p-2 rounded"
      />
      
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border p-2 rounded"
      />
      
      <div className="flex gap-2">
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-1/2 border p-2 rounded"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-1/2 border p-2 rounded"
        />
      </div>
      
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border p-2 rounded"
      />
      
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Add Shift
      </button>
    </form>
  );
}

export default ShiftForm;
