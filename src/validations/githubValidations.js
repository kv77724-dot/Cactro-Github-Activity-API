const Joi = require("joi");

const usernameSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .min(3)
    .max(30)
    .required(),
});

const repoSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .min(3)
    .max(30)
    .required(),
  repoName: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .min(1)
    .max(100)
    .required(),
});

const issueSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .min(3)
    .max(30)
    .required(),
  repoName: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .min(1)
    .max(100)
    .required(),
  title: Joi.string().min(5).max(255).required(),
  body: Joi.string().allow("").optional(),
});

module.exports = { usernameSchema, repoSchema, issueSchema };
