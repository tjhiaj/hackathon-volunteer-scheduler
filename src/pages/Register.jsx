import React, { useState } from "react";

const Register = ({ setUser, setTab }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("volunteer");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) return setError("All fields are required.");

    try {
      const res = await fetch("http://localhost:4000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);

      setUser(data); // store newly registered user
      setTab(role === "admin" ? "admin" : "volunteer");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {error && <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mb-2">
        <label className="block font-semibold">Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded w-full" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded w-full" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded w-full" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Role</label>
        <select value={role} onChange={e => setRole(e.target.value)} className="border p-2 rounded w-full">
          <option value="volunteer">Volunteer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded mt-2">Register</button>
    </div>
  );
};

export default Register;
