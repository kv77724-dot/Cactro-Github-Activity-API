const { default: axios } = require("axios");
const AppError = require("../utils/appError");
const {
  usernameSchema,
  repoSchema,
  issueSchema,
} = require("../validations/githubValidations");

const GITHUB_API_URL = `https://api.github.com/users/{GITHUB_USERNAME}`;
const GITHUB_REPOS_URL = `https://api.github.com/users/{GITHUB_USERNAME}/repos`;

const handleGetUserAndProjectData = async (query) => {
  const { error, value } = usernameSchema.validate({
    ...query,
  });

  if (error) {
    throw new AppError(error.details[0]?.message, "VALIDATION_ERROR", 400);
  }

  try {
    const { username } = value || {};
    const [profileRes, reposRes] = await Promise.all([
      axios.get(GITHUB_API_URL.replace("{GITHUB_USERNAME}", username), {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      }),
      axios.get(GITHUB_REPOS_URL.replace("{GITHUB_USERNAME}", username), {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      }),
    ]);

    const profile = profileRes.data;
    const repos = reposRes.data
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        updated_at: repo.updated_at,
      }));

    return {
      username: profile.login,
      name: profile.name,
      avatar: profile.avatar_url,
      followers: profile.followers,
      following: profile.following,
      public_repos: profile.public_repos,
      github_url: profile.html_url,
      repos,
    };
  } catch (error) {
    if (err?.response && err?.response?.status === 404) {
      throw new AppError("User not found!", "INVALID_INPUT", 500);
    }
    throw new AppError(
      "Failed to fetch GitHub data",
      "INTERNAL_SERVER_ERROR",
      500
    );
  }
};

const handleGetRepositoryData = async (query, params) => {
  const { repoName } = params;
  const { username } = query;

  const { error } = repoSchema.validate({ repoName, username });

  if (error) {
    throw new AppError(error.details[0]?.message, "VALIDATION_ERROR", 400);
  }

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}`,
      {
        headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
      }
    );

    const repoData = response.data;

    return {
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      url: repoData.html_url,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
    };
  } catch (err) {
    if (err?.response && err?.response?.status === 404) {
      throw new AppError("Repository not found!", "INVALID_INPUT", 404);
    } else {
      throw new AppError(
        "Failed to fetch Repository Data",
        "INTERNAL_SERVER_ERROR",
        500
      );
    }
  }
};

const handleCreateIssueInRepository = async (body, params, query) => {
  const { repoName } = params;
  const { title, body: issueBody } = body;
  const { username } = query;

  const { error } = issueSchema.validate({
    repoName,
    username,
    title,
    body: issueBody,
  });

  if (error) {
    throw new AppError(error.details[0]?.message, "VALIDATION_ERROR", 400);
  }

  try {
    const response = await axios.post(
      `https://api.github.com/repos/${username}/${repoName}/issues`,
      { title, body: issueBody },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    return { issue_url: response.data.html_url };
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw new AppError("Repository not found!", "INVALID_INPUT", 404);
    } else if (err.response && err.response.status === 401) {
      throw new AppError(
        "Unauthorized: Check your GitHub Token",
        "UNAUTORIZED",
        401
      );
    } else {
      throw new AppError("Something went wrong!", "INTERNAL_SERVER_ERROR", 500);
    }
  }
};

module.exports = {
  handleGetUserAndProjectData,
  handleGetRepositoryData,
  handleCreateIssueInRepository,
};
