const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus
} = require('../controllers/userController');

const User = require('../models/User');
const advancedResults = require('../middleware/advancedResultsMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect and authorize all routes below
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.put('/:id/status', toggleUserStatus);

module.exports = router;