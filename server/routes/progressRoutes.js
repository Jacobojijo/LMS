const express = require("express");
const {
  initializeProgress,
  getProgress,
  markTopicViewed,
  submitPracticeAttempt,
  submitCATAttempt,
  canAccessNextTopic,
  canAccessNextModule,
  getStudentProgressSummary,
} = require("../controllers/progressTrackerController");

const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

// Routes with all auth
router.use(protect);

// Student and admin routes
router.post("/initialize", initializeProgress);
router.get("/:courseId", getProgress);
router.put("/view-topic/:courseId/:topicId", markTopicViewed);
router.post(
  "/practice-attempt/:courseId/:topicId/:questionId",
  submitPracticeAttempt
);
router.post("/cat-attempt/:courseId/:moduleId", submitCATAttempt);
router.get("/can-access/:courseId/next-topic/:topicId", canAccessNextTopic);
router.get("/can-access/:courseId/next-module/:moduleId", canAccessNextModule);

// Admin only routes
router.get(
  "/admin/summary/:userId",
  authorize("admin"),
  getStudentProgressSummary
);

module.exports = router;
