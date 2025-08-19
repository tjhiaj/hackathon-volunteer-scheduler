import React from "react";

function ScheduleTable({ shifts }) {
  if (!shifts.length) return <p>No shifts added yet.</p>;

  return (
    <table className="min-w-full bg-white border rounded shadow-md mt-4">
      <thead className="bg-purple-600 text-white">
        <tr>
          <th className="p-2">Role</th>
          <th className="p-2">Date</th>
          <th className="p-2">Start</th>
          <th className="p-2">End</th>
          <th className="p-2">Location</th>
        </tr>
      </thead>
      <tbody>
        {shifts.map((shift, idx) => (
          <tr key={idx} className="border-t text-center">
            <td className="p-2">{shift.role}</td>
            <td className="p-2">{shift.date}</td>
            <td className="p-2">{shift.startTime}</td>
            <td className="p-2">{shift.endTime}</td>
            <td className="p-2">{shift.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ScheduleTable;
