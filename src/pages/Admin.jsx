import React, { useState } from "react";
import ShiftForm from "../components/ShiftForm";
import ScheduleTable from "../components/ScheduleTable";

function Admin() {
  const [shifts, setShifts] = useState([]);

  const handleAddShift = (shift) => {
    setShifts([...shifts, shift]);
  };

  return (
    <div className="space-y-6">
      <ShiftForm onAddShift={handleAddShift} />
      <ScheduleTable shifts={shifts} />
    </div>
  );
}

export default Admin;
