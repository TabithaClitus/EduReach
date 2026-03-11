const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const ctrl = require("../controllers/mentor.controller");

router.get("/", ctrl.getMentors);
router.get("/list", ctrl.getMentorList);
router.post("/request", verifyToken, ctrl.requestMentor);
router.get("/my-request", verifyToken, ctrl.getMyRequestStatus);  // student: get status
router.get("/my-requests", verifyToken, ctrl.getMyRequests);       // student: list view
router.get("/incoming", verifyToken, ctrl.getIncomingRequests);
router.patch("/request/:matchId", verifyToken, ctrl.respondToRequest);
router.get("/active-matches", verifyToken, ctrl.getActiveMatches);
router.get("/my-students", verifyToken, ctrl.getMyStudents);
router.get("/messages/:matchId", verifyToken, ctrl.getMessages);
router.post("/rate/:matchId", verifyToken, ctrl.rateMentor);
router.get("/my-mentor", verifyToken, ctrl.getMyMentor);
router.get("/pending", verifyToken, ctrl.getPendingRequests);
router.post("/end/:matchId", verifyToken, ctrl.endMentorship);

module.exports = router;
