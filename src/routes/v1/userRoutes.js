const express = require('express');
const router = express.Router();
const { checkUserWithEmail, hashPassword, validateUser } = require('../../helper/userHelper');
const ResponseFormat = require('../responseFormat');
const Joi = require('joi');
const User = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/register', async (req, res) => {

  const registerSchema = Joi.object({
    username: Joi.string().max(255).required(),
    fullname: Joi.string().max(255).required(),
    email_address: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).required()
  });

  try {
    await validateUser(req, res, registerSchema);
    const validatedUser = req.validatedData;

    const isExist = await checkUserWithEmail(validatedUser.email_address);

    if (isExist.length !== 0) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    let response;

    validatedUser.password = await hashPassword(validatedUser.password);
    // Store hashed password
    const inserted = await User.query().insert(validatedUser);

    response = ResponseFormat.success({
      code: 201,
      messageText: "Created",
      dataOut: { username: inserted.username, email: inserted.email_address }
    });

    return res.status(response.meta.code).json(response);


  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});


router.post('/login', async (req, res) => {

  const loginSchema = Joi.object({
    email_address: Joi.string().email().max(255).required(),
    password: Joi.string().required()
  });
  const secret = process.env.JWT_SECRET || 'default_secret';

  try {
    await validateUser(req, res, loginSchema);
    const validatedUser = req.validatedData;
    let response;

    //check if the user is existed
    const userAccount = await checkUserWithEmail(validatedUser.email_address);

    if (!userAccount || userAccount.length == 0) {
      response = ResponseFormat.error({ code: 404, messageText: "Account not found" });
      return res.status(response.meta.code).json(response);
    }
    //authenticating
    const isAuthenticated = await bcrypt.compare(validatedUser.password, userAccount[0].password);
    if (isAuthenticated) {
      let token = jwt.sign({ id: userAccount[0].id, username: userAccount[0].username }, secret, { expiresIn: '12h' });
      response = ResponseFormat.success({ messageText: 'Authenticated', dataOut: { access_token: token, token_type: 'bearer' } });
      return res.status(response.meta.code).json(response);
    }
    else {
      response = ResponseFormat.error({ code: 401, messageText: "Invalid credentials" });
      return res.status(response.meta.code).json(response);
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});


module.exports = router;
