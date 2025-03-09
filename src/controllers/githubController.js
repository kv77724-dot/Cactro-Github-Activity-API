const { errorResponse, successResponse } = require("../config/responseHandler");
const githubService = require("../services/githubService");

const githubUserAndRepositoriesData = async (req, res) => {
  try {
    const data = await githubService.handleGetUserAndProjectData(req.body);
    successResponse(res, "User Project and Personal data", data, 200);
  } catch (error) {
    errorResponse(
      res,
      error.message || "User does not exist",
      error.code,
      error.status || 500
    );
  }
};

module.exports = { githubUserAndRepositoriesData };
