const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const topicsControlers = require("../controllers/topics-controller");

router.get("/", topicsControlers.getAllOrFilteredTopics);
router.get("/:tid", topicsControlers.getTopicById);
router.get("/filtered/:filterType", topicsControlers.getAllOrFilteredTopics);
// the middelware go from left to right and excute the parameters that way so we do validation before the controller
router.post(
  "/",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  topicsControlers.createTopic
);
router.post("/vote/:tid", topicsControlers.voteForTopic);
router.patch("/:tid", topicsControlers.updateTopicById);
router.delete("/:tid", topicsControlers.deleteTopicById);
module.exports = router;
