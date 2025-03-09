const { default: axios } = require("axios");
const AppError = require("../utils/appError");
const { usernameSchema } = require("../validations/githubValidations");

const GITHUB_API_URL = `https://api.github.com/users/{GITHUB_USERNAME}`;
const GITHUB_REPOS_URL = `https://api.github.com/users/{GITHUB_USERNAME}/repos`;

const handleGetUserAndProjectData = async (body) => {
  const { error, value } = usernameSchema.validate({
    ...body,
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
    console.error("Error fetching GitHub data:", error);
    if (error?.status === 404) {
      throw new AppError("User not found!", "INVALID_INPUT", 500);
    }
    throw new AppError(
      "Failed to fetch GitHub data",
      "INTERNAL_SERVER_ERROR",
      500
    );
  }
};

module.exports = { handleGetUserAndProjectData };
