// server.js
import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite DB
const db = new Database("db/database.sqlite");

// Create tables if they don't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    date TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    location TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS volunteers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shiftId INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    FOREIGN KEY(shiftId) REFERENCES shifts(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'volunteer'))
  )
`).run();

// Get shifts (with optional filters)
app.get("/shifts", (req, res) => {
  const { day, role, volunteer } = req.query;

  try {
    let sql = `
      SELECT s.id, s.day, s.startTime, s.endTime, s.role,
             v.name as volunteerName, v.email as volunteerEmail
      FROM shifts s
      LEFT JOIN volunteers v ON s.id = v.shiftId
    `;
    const params = [];

    const conditions = [];
    if (day) {
      conditions.push("s.day = ?");
      params.push(day);
    }
    if (role) {
      conditions.push("s.role = ?");
      params.push(role);
    }
    if (volunteer) {
      conditions.push("(v.name LIKE ? OR v.email LIKE ?)");
      params.push(`%${volunteer}%`, `%${volunteer}%`);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    const rows = db.prepare(sql).all(...params);

    // Reformat into shifts with volunteer arrays
    const shifts = {};
    rows.forEach(r => {
      if (!shifts[r.id]) {
        shifts[r.id] = {
          id: r.id,
          day: r.day,
          startTime: r.startTime,
          endTime: r.endTime,
          role: r.role,
          volunteers: []
        };
      }
      if (r.volunteerName) {
        shifts[r.id].volunteers.push({ name: r.volunteerName, email: r.volunteerEmail });
      }
    });

    res.json(Object.values(shifts));
  } catch (err) {
    console.error("Error fetching shifts:", err);
    res.status(500).json({ error: "Failed to fetch shifts" });
  }
});

// Add new shift
app.post("/shifts", (req, res) => {
  const { role, date, startTime, endTime, location } = req.body;
  if (!role || !date || !startTime || !endTime || !location) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const stmt = db.prepare("INSERT INTO shifts (role, date, startTime, endTime, location) VALUES (?, ?, ?, ?, ?)");
  const info = stmt.run(role, date, startTime, endTime, location);

  const shift = db.prepare("SELECT * FROM shifts WHERE id = ?").get(info.lastInsertRowid);
  shift.volunteers = [];
  res.status(201).json(shift);
});

// Edit a shift
app.put("/shifts/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { role, date, startTime, endTime, location } = req.body;

    if (!role || !date || !startTime || !endTime || !location) {
      return res.status(400).json({ error: "All fields required" });
    }

    const stmt = db.prepare(
      `UPDATE shifts
       SET role = ?, date = ?, startTime = ?, endTime = ?, location = ?
       WHERE id = ?`
    );
    const info = stmt.run(role, date, startTime, endTime, location, id);

    if (info.changes === 0) {
      return res.status(404).json({ error: "Shift not found" });
    }

    const updated = db.prepare("SELECT * FROM shifts WHERE id = ?").get(id);
    const volunteers = db.prepare("SELECT name, email FROM volunteers WHERE shiftId = ?").all(id);
    updated.volunteers = volunteers;

    console.log("Shift updated:", updated);
    return res.json(updated);
  } catch (err) {
    console.error("PUT /shifts/:id error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Delete a shift
app.delete("/shifts/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // delete volunteers first (if you want cascade delete)
    db.prepare("DELETE FROM volunteers WHERE shiftId = ?").run(id);

    // then delete shift
    const stmt = db.prepare("DELETE FROM shifts WHERE id = ?");
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: "Shift not found" });
    }

    return res.json({ success: true, id });
  } catch (err) {
    console.error("DELETE /shifts/:id error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Sign up for a shift
app.post("/shifts/:id/volunteer", (req, res) => {
  const shiftId = parseInt(req.params.id);
  const { name, email } = req.body;

  const shift = db.prepare("SELECT * FROM shifts WHERE id = ?").get(shiftId);
  if (!shift) return res.status(404).json({ error: "Shift not found" });
  if (!name || !email) return res.status(400).json({ error: "Name and email required" });

  const existing = db.prepare("SELECT * FROM volunteers WHERE shiftId = ? AND email = ?").get(shiftId, email);
  if (existing) return res.status(400).json({ error: "Already signed up" });

  db.prepare("INSERT INTO volunteers (shiftId, name, email) VALUES (?, ?, ?)").run(shiftId, name, email);

  const volunteers = db.prepare("SELECT name, email FROM volunteers WHERE shiftId = ?").all(shiftId);
  res.json({ ...shift, volunteers });
});

// Un-signup from a shift
app.delete("/shifts/:id/volunteer", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    // Delete the volunteer row from the database
    const stmt = db.prepare("DELETE FROM volunteers WHERE shiftId = ? AND name = ? AND email = ?");
    const result = stmt.run(id, name, email);

    if (result.changes === 0) {
      return res.status(400).json({ error: "You were not signed up for this shift." });
    }

    res.json({ message: "Successfully un-signed from shift" });
  } catch (err) {
    console.error("Error un-signing up:", err);
    res.status(500).json({ error: "Failed to un-sign from shift" });
  }
});

// Register a new user
app.post("/users/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const stmt = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    const info = stmt.run(name, email, hashed, role);

    res.status(201).json({ id: info.lastInsertRowid, name, email, role });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login user
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // Return user info (in production, return a token)
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
