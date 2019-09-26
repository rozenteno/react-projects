const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// Express validator
const { check, validationResult } = require("express-validator");

// Mongoose User Model
const User = require("../models/User");

// @route   POST api/users
// @desc   Register a user
// @access   Public

router.post(
  "/",
  // All validations using express validator
  [
    check("name", "Please add a Name")
      // Check if name is empty
      .not()
      .isEmpty(),
    // Check if email is valid
    check("email", "Please include a valid email").isEmail(),
    // Check if password fulfills requirements
    check(
      "password",
      "Please enter a password with six or more characters"
    ).isLength({
      // isLength belongs to express validator.
      min: 6,
      max: 10
    })
  ],
  async (req, res) => {
    // errors will be the errors that the req will send
    // only routes that will receive data and validation
    const errors = validationResult(req);
    // if there are any errors display them as a JSON with a 400 status
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructure from the request
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      // new user using the User model
      user = new User({
        name: name,
        email: email,
        password: password
      });

      // Generate hash key called salt
      const salt = await bcrypt.genSalt(10);
      // user object using User model
      // Hash the password with the salt and password
      user.password = await bcrypt.hash(password, salt);
      // Now save the user in the db
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        // jwtSecret is in default.json
        config.get("jwtSecret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
