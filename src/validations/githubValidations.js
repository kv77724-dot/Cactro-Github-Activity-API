const Joi = require("joi");

const usernameSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/) // Allows letters, numbers, hyphens, and underscores
    .min(3) // At least 3 characters
    .max(30) // At most 30 characters
    .required(),
});

module.exports = { usernameSchema };
