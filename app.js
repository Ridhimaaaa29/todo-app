const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware to log request timestamps
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Read tasks from tasks.json
const getTasks = () => {
    try {
        const data = fs.readFileSync('tasks.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading tasks.json:', err);
        return [];
    }
};

// GET /tasks → Show all tasks
app.get('/tasks', (req, res) => {
    const tasks = getTasks();
    res.render('tasks', { tasks });
});

// GET /task?id=1 → Fetch a specific task
app.get('/task', (req, res) => {
    const tasks = getTasks();
    const taskId = req.query.id;
    const task = tasks.find(t => t.id == taskId);

    if (!task) {
        return res.status(404).send('Task not found');
    }

    res.render('task', { task });
});

// POST /add-task → Add a new task
app.use(express.urlencoded({ extended: true }));
// GET /add-task → Show the form to add a new task
app.get('/add-task', (req, res) => {
    res.render('addTask'); // This will render the 'addTask.ejs' form
});

// POST /add-task → Add a new task
app.use(express.urlencoded({ extended: true }));
app.post('/add-task', (req, res) => {
    const tasks = getTasks();
    const newTask = {
        id: tasks.length + 1,
        name: req.body.name
    };

    tasks.push(newTask);
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));

    res.redirect('/tasks');
});

app.post('/add-task', (req, res) => {
    const tasks = getTasks();
    const newTask = {
        id: tasks.length + 1,
        name: req.body.name
    };

    tasks.push(newTask);
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));

    res.redirect('/tasks');
});
app.get("/", (req, res) => {
    res.send("Welcome to the To-Do List App! Use /tasks to view tasks.");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
