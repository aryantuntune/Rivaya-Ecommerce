const express = require('express');
const { register, login, getMe, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.delete('/me', protect, deleteAccount);
router.get('/users', protect, require('../middleware/auth').authorize('admin'), require('../controllers/authController').getAllUsers);

module.exports = router;
