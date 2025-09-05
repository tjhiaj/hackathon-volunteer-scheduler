import React from "react";
const ScheduleTable = ({ shifts }) => {
  if (!shifts.length) return <p>No shifts added yet.</p>;

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Role</th>
          <th className="border p-2">Date</th>
          <th className="border p-2">Time</th>
          <th className="border p-2">Location</th>
          <th className="border p-2">Volunteers</th>
        </tr>
      </thead>
      <tbody>
        {shifts.map((shift, idx) => (
          <tr key={idx}>
            <td className="border p-2">{shift.role}</td>
            <td className="border p-2">{shift.date}</td>
            <td className="border p-2">
              {shift.startTime}–{shift.endTime}
            </td>
            <td className="border p-2">{shift.location}</td>
            <td className="border p-2">
              {shift.volunteers.length > 0 ? (
                <ul className="list-disc pl-5">
                  {shift.volunteers.map((v, i) => (
                    <li key={i}>
                      {v.name} ({v.email})
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScheduleTable;
