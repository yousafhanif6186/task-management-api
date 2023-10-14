import express, { Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();

type Task = Required<{
    id: string; // Unique Identifier (you can use a string or number)
    title: string;
    description: string;
    creationDate: Date;
    dueDate: Date;
    assignedTo: string; // You can use a user ID or username here
    category: string; // You can define a more structured category type if needed
    status: 'Pending' | 'Completed';
}>;

// Example in-memory data store
const tasks: Task[] = [];

// Define middleware for validation errors
const validate = (req: Request, res: Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const createValidator = [
    body('title', 'title should not be empty').not().isEmpty(),
    body('description', 'description should not be empty').not().isEmpty(),
    body('creationDate', 'creationDate should not be empty').not().isEmpty(),
    body('dueDate', 'dueDate should not be empty').not().isEmpty(), // check date is ISOString
    body('assignedTo', 'assignedTo should not be empty').not().isEmpty(),
    body('category', 'category should not be empty').not().isEmpty(),
    body('status', 'status should not be empty').not().isEmpty(),
]


// Create a new task
router.post('/task', createValidator, validate, (req: any, res: any) => {
    const newTask = req.body;
    newTask.id = uuidv4();
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Retrieve a task by its ID
router.get('/task/:id', (req: Request, res: Response) => {
    const taskId = req.params.id;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
        res.status(404).json({ message: 'Task not found' });
    } else {
        res.json(task);
    }
});

// Update a specific task
router.put('/task/:id', (req: Request, res: Response) => {
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
        res.status(404).json({ message: 'Task not found' });
    } else {
        const task = tasks[taskIndex];
        updateObject(task, req.body)
        tasks[taskIndex] = task;
        res.json(task);
    }
});

// Delete a specific task
router.delete('/task/:id', (req: Request, res: Response) => {
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
        res.status(404).json({ message: 'Task not found' });
    } else {
        tasks.splice(taskIndex, 1);
        res.json({ message: 'Task deleted' });
    }
});

// Retrieve all tasks
router.get('/tasks', (req: Request, res: Response) => {
    const assignedTo = req.query.assignedTo as string;
    const category = req.query.category as string;
    if (assignedTo) {
        const filteredTasks = tasks.filter((t) => t.assignedTo === assignedTo);
        res.json(filteredTasks);
    } else if (category) {
        const filteredTasks = tasks.filter((t) => t.category === category);
        res.json(filteredTasks);
    } else {
        res.json(tasks);
    }
});

function updateObject(target: any, source: any) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
}

export default router;