const express = require('express');
const router = express.Router();
const { checkUserWithEmail, hashPassword } = require('../../helper/userHelper');
const ResponseFormat = require('../responseFormat');
const Joi = require('joi');
const { val } = require('objection');
const User = require('../../models/userModel');

const registerSchema = Joi.object({
  username: Joi.string().max(255).required(),
  fullname: Joi.string().max(255).required(),
  email_address: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).required()
});

async function validateUser(req, res, next) {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (await checkUserWithEmail(value.email_address)) {
    return res.status(400).json({ error: "Email is already in used" });
  }
  req.validatedData = value;
  next();
}


router.post('/register', validateUser, async (req, res) => {

  try {
    const validatedUser = req.validatedData;

    //stored hashed password
    validatedUser.password = await hashPassword(validatedUser.password);

    const inserted = await User.query().insert(validatedUser);

    const response = ResponseFormat.success({ code: 201, messageText: "Created", dataOut: { username: inserted.username, email: inserted.email_address } });

    return res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}
);

module.exports = router;