/* routes taskRoutes.js */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Public route (no auth needed)
router.get('/get-all', auth, role('admin', 'editor', 'viewer'), taskController.getAllTasks);
router.get('/single-task/:id', auth, role('admin', 'editor', 'viewer'), taskController.getTaskById);

// Restricted to admin and editor
router.post('/create', auth, role('admin', 'editor'), taskController.createTask);
router.put('/update/:id', auth, role('admin', 'editor'), taskController.updateTask);

// Restricted to admin only
router.delete('/delete/:id', auth, role('admin'), taskController.deleteTask);

module.exports = router;