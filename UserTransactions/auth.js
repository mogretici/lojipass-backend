const Joi = require("joi").defaults((schema) =>
  schema.options({
    messages: {
      tr: {
        "string.empty": "Alan boş olamaz {{#error}} ",
        "number.base": "{{#label}} değeri sayı olmalıdır",
        "any.invalid": "{{#label}} değeri geçersizdir",
        "phoneNumber.invalid": "{{#label}} değeri geçersizdir",
        "array.unique": "{{#label}} değeri benzersiz olmalıdır",
        "string.min": "{{#label}} en az {{#limit}} karakter olmalıdır",
        "string.max": "{{#label}} en fazla {{#limit}} karakter olmalıdır",
        "string.email": "Geçersiz email adresi",
        "string.pattern.base": "Geçersiz {{#label}}",
      },
    },
  })
);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
require("dotenv").config();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Kullanıcı adı veya şifre hatalı");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Kullanıcı adı veya şifre hatalı");
  }
  const token = jwt.sign({ _id: user._id }, process.env.PRIVATEKEY);
  res.send({
    token: token,
    user: _.pick(user, [
      "_id",
      "name",
      "email",
      "identificationNumber",
      "dateOfBirth",
      "sex",
    ]),
  });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(req, { errors: { language: "tr" } });
}

module.exports = router;
