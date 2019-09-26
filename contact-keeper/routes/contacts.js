const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Express validator
const { check, validationResult } = require("express-validator");

// Mongoose User Model
const User = require("../models/User");
// Contact Model
const Contact = require("../models/Contact");

// @route   GET api/contacts
// @desc   Register a user
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
// @route   POST api/contacts
// @desc   Add new contact
// @access   Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // errors will be the errors that the req will send
    // only routes that will receive data and validation
    const errors = validationResult(req);
    // if there are any errors display them as a JSON with a 400 status
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error puto");
    }
  }
);
// @route   PUT api/contacts/:id
// @desc   Update a user
// @access   Private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    // Find contact by id
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact not found" });

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Make the update
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error puto 2");
  }
});
// @route   DELETE api/contacts/:id
// @desc   Delete a user
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find contact by id
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact not found" });

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "Contact Removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error puto 3");
  }
});

module.exports = router;
