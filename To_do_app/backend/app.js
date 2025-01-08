import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Todo from "./model/Todo.js";

// ✅ Database Connection
try {
  mongoose.connect("mongodb://127.0.0.1:27017/Todo_App").then(() => {
    console.log("✅ Connected to MongoDB");
  });
} catch (e) {
  console.error("❌ DB Connection Error: ", e);
}

// ✅ Initialize Express App
const app = express();
app.use(express.json());
app.use(cors());

const port = 8080;

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Todo API!");
  console.log("Root Route Accessed");
});

// ✅ Get All Todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (e) {
    console.error("❌ Error fetching todos:", e);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ✅ Add a New Todo
app.post("/todo", async (req, res) => {
  try {
    const newTodo = new Todo({
      task: req.body.task,
      isCompleted: false,
    });
    await newTodo.save();
    res.status(201).json(newTodo); // Return the created todo
    console.log("✅ Todo Added:", newTodo);
  } catch (e) {
    console.error("❌ Error adding todo:", e);
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// ✅ Update a Todo
app.put("/todo/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        task: req.body.task,
        isCompleted: req.body.isCompleted,
      },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
    console.log("✅ Todo Updated:", updatedTodo);
  } catch (e) {
    console.error("❌ Error updating todo:", e);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// ✅ Delete a Todo
app.delete("/todo/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully", deletedTodo });
    console.log("✅ Todo Deleted:", deletedTodo);
  } catch (e) {
    console.error("❌ Error deleting todo:", e);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// ✅ Start the Server
app.listen(port, () => {
  console.log(`🚀 Server started at: http://localhost:${port}`);
});
