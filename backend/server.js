// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/todolist_db";
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Model tugas
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

// --- ROUTES CRUD ---

// GET semua tugas
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ archived: false });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tambah tugas
app.post("/tasks", async (req, res) => {
  try {
    const { name } = req.body;
    const newTask = new Task({ name });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update status selesai
app.put("/tasks/:id/complete", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Tugas tidak ditemukan" });
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT arsipkan tugas
app.put("/tasks/:id/archive", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Tugas tidak ditemukan" });
    task.archived = true;
    await task.save();
    res.json({ message: "Tugas berhasil diarsipkan" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE hapus tugas
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Tugas berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET semua tugas yang diarsipkan
app.get("/tasks/archived", async (req, res) => {
  try {
    const tasks = await Task.find({ archived: true });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Jalankan server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
