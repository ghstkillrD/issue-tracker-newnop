const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getIssueStats
} = require('../controllers/issueController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(getIssues)      // GET /api/issues - Get all issues with filters
  .post(createIssue);  // POST /api/issues - Create new issue

router.get('/stats', getIssueStats);  // GET /api/issues/stats - Get statistics

router.route('/:id')
  .get(getIssueById)   // GET /api/issues/:id - Get single issue
  .put(updateIssue)    // PUT /api/issues/:id - Update issue
  .delete(deleteIssue); // DELETE /api/issues/:id - Delete issue

module.exports = router;
