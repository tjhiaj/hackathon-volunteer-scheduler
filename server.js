// server.js
import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

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

// Get all shifts with volunteers
app.get("/shifts", (req, res) => {
  const shifts = db.prepare("SELECT * FROM shifts").all();
  const result = shifts.map(shift => {
    const volunteers = db.prepare("SELECT name, email FROM volunteers WHERE shiftId = ?").all(shift.id);
    return { ...shift, volunteers };
  });
  res.json(result);
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

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
