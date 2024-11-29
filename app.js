const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');

// Import Task model
const Task = require('./models/tasks');

// Initialize Express app
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory where your views (EJS templates) will be stored
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded data (like form submissions)
app.use(express.json());  // Parse JSON data
app.use(methodOverride('_method'));  // Allow PUT and DELETE methods via query parameter

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todoApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Routes

// Home Route (View Tasks)
app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.render('index', { tasks });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Add Task
app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task({ name: req.body.task });
        await newTask.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error adding task:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Edit Task
app.put('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, { name: req.body.task });
        res.redirect('/');
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete Task
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
