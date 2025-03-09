const Joi = require("joi");

const usernameSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .min(3)
    .max(30)
    .required(),
});

const repoSchema = Joi.object({
  repoName: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .min(1)
    .max(100)
    .required(),
});

module.exports = { usernameSchema, repoSchema };
