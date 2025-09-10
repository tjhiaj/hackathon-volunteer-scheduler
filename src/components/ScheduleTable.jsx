import React, { useState } from "react";

const ScheduleTable = ({ 
  shifts, 
  mode, 
  onSignUp, 
  onUnsignUp, 
  onEdit, 
  onDelete,
  userEmail 
}) => {
  const [filters, setFilters] = useState({ role: "", day: "", volunteer: "" });

  const filteredShifts = shifts.filter((shift) => {
    const matchesRole = filters.role ? shift.role.toLowerCase().includes(filters.role.toLowerCase()) : true;
    const matchesDay = filters.day ? shift.date === filters.day : true;
    const matchesVolunteer = filters.volunteer
      ? shift.volunteers.some(v =>
          v.name.toLowerCase().includes(filters.volunteer.toLowerCase()) ||
          v.email.toLowerCase().includes(filters.volunteer.toLowerCase())
        )
      : true;
    return matchesRole && matchesDay && matchesVolunteer;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          placeholder="Filter by role"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={filters.day}
          onChange={(e) => setFilters({ ...filters, day: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Filter by volunteer"
          value={filters.volunteer}
          onChange={(e) => setFilters({ ...filters, volunteer: e.target.value })}
          className="border p-2 rounded"
        />
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
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredShifts.length === 0 ? (
            <tr>
              <td colSpan="7" className="border p-2 text-center">No shifts match filters.</td>
            </tr>
          ) : (
            filteredShifts.map((shift) => (
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
                <td className="border p-2 space-x-2">
                  {mode === "volunteer" && (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => onSignUp(shift.id, shift.role)}
                      >
                        Sign Up
                      </button>
                      {shift.volunteers.some(v => v.email === userEmail) && (
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                          onClick={() => onUnsignUp(shift.id)}
                        >
                          Un-Sign
                        </button>
                      )}
                    </>
                  )}
                  {mode === "admin" && (
                    <>
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => onEdit(shift)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => onDelete(shift.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
