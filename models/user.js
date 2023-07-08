const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    identificationNumber: {
      type: String,
      required: true,
      minlength: 11,
      maxlength: 11,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
  })
);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    identificationNumber: Joi.string().min(11).max(11).required(),
    dateOfBirth: Joi.string().required(),
    sex: Joi.string().required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
