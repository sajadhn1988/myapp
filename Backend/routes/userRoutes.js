/* routes userRoutes.js */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/update-role/:id', auth, role('admin'), userController.updateUserRole);
router.get('/admin-user-list', auth, role('admin'), userController.getAllUsers);

module.exports = router;