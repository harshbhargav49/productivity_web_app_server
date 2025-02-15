const express = require("express");
const auth = require("../middleware/authMiddleware");
const Todo = require("../models/Todo");

const router = express.Router();

// Create a new Todo
router.post("/", auth, async (req, res) => {
    try {
        const { title } = req.body;
        const newTodo = new Todo({ userId: req.user.userId, title });
        await newTodo.save();
        res.json(newTodo);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// Get all Todos for logged-in user
router.get("/", auth, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.userId });
        res.json(todos);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// Update a Todo
router.put("/:id", auth, async (req, res) => {
    try {
        const { title, completed } = req.body;
        const todo = await Todo.findById(req.params.id);
        if (!todo || todo.userId.toString() !== req.user.userId) return res.status(404).json({ msg: "Todo not found" });

        todo.title = title !== undefined ? title : todo.title;
        todo.completed = completed !== undefined ? completed : todo.completed;
        await todo.save();

        res.json(todo);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// Delete a Todo
router.delete("/:id", auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo || todo.userId.toString() !== req.user.userId) return res.status(404).json({ msg: "Todo not found" });

        await todo.deleteOne();
        res.json({ msg: "Todo deleted" });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;
