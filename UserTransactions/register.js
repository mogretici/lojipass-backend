const { User, validate } = require("../models/user");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("That user already exisits!");
  } else {
    user = new User(
      _.pick(req.body, [
        "name",
        "email",
        "password",
        "identificationNumber",
        "dateOfBirth",
        "sex",
      ])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.PRIVATEKEY);

    res
      .header("x-auth-token", token)
      .status(200)
      .send(
        _.pick(user, [
          "_id",
          "name",
          "email",
          "identificationNumber",
          "dateOfBirth",
          "sex",
        ])
      );
  }
});

module.exports = router;
