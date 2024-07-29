const express = require('express');
const router = express.Router();
const { checkUserWithEmail, hashPassword, validateUser } = require('../../helper/userHelper');
const ResponseFormat = require('../responseFormat');
const Joi = require('joi');
const User = require('../../models/userModel');
const Sessions = require('../../models/sessionModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../../middleware/verifyToken');
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

      await Sessions.query().patch({ is_valid: false }).where('user_id', userAccount[0].id);

      let token = jwt.sign({ id: userAccount[0].id, username: userAccount[0].username }, secret, { expiresIn: '12h' });

      await Sessions.query().insert({
        user_id: userAccount[0].id,
        token: token,
        is_valid: true
      });

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


router.get('/detail', verifyToken, async (req, res) => {
  let response;
  const userId = req.user.id;

  try {

    const userDetail = await User.query().where('id', userId);

    response = ResponseFormat.success({
      code: 200,
      messageText: "Success",
      dataOut: {
        id: userDetail[0].id,
        username: userDetail[0].username,
        fullname: userDetail[0].fullname,
        email_address: userDetail[0].email_address,
        role: userDetail[0].role,
        createdAt: userDetail[0].createdAt,
        updatedAt: userDetail[0].updatedAt
      }
    });

    return res.status(response.meta.code).json(response);
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
    });

  }
});

router.put('/update', verifyToken, async (req, res) => {

  const updateSchema = Joi.object({
    username: Joi.string().max(255),
    fullname: Joi.string().max(255)
  });


  let response;
  const userid = req.user.id;


  try {
    await validateUser(req, res, updateSchema);
    const validatedData = req.validatedData;

    const updatePayload = {
      username: validatedData.username,
      fullname: validatedData.fullname
    }

    const updatedUser = await User.query().patchAndFetchById(userid, updatePayload)

    response = ResponseFormat.success({
      code: 200,
      messageText: "Updated",
      dataOut: {
        username: updatedUser.username,
        fullname: updatedUser.fullname
      }
    })

    return res.status(response.meta.code).json(response);

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
})

router.post('/logout', verifyToken, async (req, res) => {
  const authHeader = req.header('Authorization');

  const token = authHeader.split(' ')[1];

  try {
    const response = ResponseFormat.success({
      code: 200,
      messageText: "Logged out successfully",
    })

    await Sessions.query().patch({ is_valid: false }).where('token', token);

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;
