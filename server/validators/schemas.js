const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  fullName: Joi.string().min(2).max(60).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(60),
  bio: Joi.string().max(200).allow(''),
  email: Joi.string().email(),
}).min(1);

const messageSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join('; ');
    return res.status(400).json({ success: false, message: messages });
  }
  next();
};

module.exports = { registerSchema, loginSchema, updateProfileSchema, messageSchema, validate };
