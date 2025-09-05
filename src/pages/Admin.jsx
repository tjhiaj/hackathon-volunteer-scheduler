import React, { useState } from "react";
import ScheduleTable from "../components/ScheduleTable";

const Admin = ({ shifts, setShifts }) => {
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  const handleAddShift = () => {
    if (!role || !date || !startTime || !endTime || !location) return;

    setShifts([
      ...shifts,
      { role, date, startTime, endTime, location, volunteers: [] }
    ]);

    // clear inputs
    setRole("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <div className="space-y-4 mb-4">
        {/* Role */}
        <div>
          <label className="block font-semibold mb-1">Role</label>
          <input
            type="text"
            placeholder="e.g. Registration Desk"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block font-semibold mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block font-semibold mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            placeholder="e.g. Main Hall"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          onClick={handleAddShift}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Shift
        </button>
      </div>

      <ScheduleTable shifts={shifts} />
    </div>
  );
};

export default Admin;
