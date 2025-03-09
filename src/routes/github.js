const express = require("express");

const router = express.Router();
const githubController = require("../controllers/githubController");

router.get("/", githubController.githubUserAndRepositoriesData);
router.get("/:repoName", githubController.githubRepositoryData);
router.post("/:repoName/issues", githubController.createIssueInRepository);

module.exports = router;
