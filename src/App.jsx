import React, { useState, useEffect } from "react";
import Admin from "./pages/Admin";
import Volunteer from "./pages/Volunteer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [tab, setTab] = useState("home");
  const [shifts, setShifts] = useState([]);
  const [user, setUser] = useState(null); // logged-in user

  const fetchShifts = async () => {
    try {
      const res = await fetch("http://localhost:4000/shifts");
      const data = await res.json();
      setShifts(data);
    } catch (err) {
      console.error("Failed to fetch shifts", err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={() => setTab("home")} className={tab === "home" ? "font-bold" : ""}>Home</button>
        {!user && (
          <>
            <button onClick={() => setTab("login")} className={tab === "login" ? "font-bold" : ""}>Login</button>
            <button onClick={() => setTab("register")} className={tab === "register" ? "font-bold" : ""}>Register</button>
          </>
        )}
        {user && (
          <>
            {user.role === "admin" && (
              <button onClick={() => setTab("admin")} className={tab === "admin" ? "font-bold" : ""}>Admin</button>
            )}
            {user.role === "volunteer" && (
              <button onClick={() => setTab("volunteer")} className={tab === "volunteer" ? "font-bold" : ""}>Volunteer</button>
            )}
            <button onClick={() => setUser(null)}>Logout</button>
          </>
        )}
      </div>

      {/* Pages */}
      {tab === "home" && <Home />}

      {tab === "login" && <Login setUser={setUser} setTab={setTab} />}
      {tab === "register" && <Register setUser={setUser} setTab={setTab} />}

      {user && user.role === "admin" && tab === "admin" && (
        <Admin shifts={shifts} setShifts={setShifts} />
      )}

      {user && user.role === "volunteer" && tab === "volunteer" && (
          <Volunteer shifts={shifts} fetchShifts={fetchShifts} user={user} />
      )}
    </div>
  );
}

export default App;
