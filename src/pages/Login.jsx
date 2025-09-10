import React, { useState } from "react";

const Login = ({ setUser, setTab }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return setError("Please enter email and password.");

    try {
      const res = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);

      setUser(data); // store logged-in user
      setTab(data.role === "admin" ? "admin" : "volunteer");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mb-2">
        <label className="block font-semibold">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded w-full" />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 rounded w-full" />
      </div>
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Login</button>
    </div>
  );
};

export default Login;
