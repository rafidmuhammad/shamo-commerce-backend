
const jwt = require('jsonwebtoken');
const ResponseFormat = require('../routes/responseFormat')
const Sessions = require('../models/sessionModel');
require('dotenv').config();

async function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    let response;

    response = ResponseFormat.error({
        code: 401,
        messageText: "Access Denied. No token provided",
        dataOut: null
    })

    if (!authHeader) {
        return res.status(response.meta.code).json(response)
    }

    const secret = process.env.JWT_SECRET || 'default_secret';
    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, secret);
        const session = await Sessions.query().where('token', token).andWhere('is_valid', true).first();
        if (!session) {
            response = ResponseFormat.error({
                code: 401,
                messageText: "Token has been invalidated",
                dataOut: null
            })
            return res.status(response.meta.code).json(response);
        }

        req.user = verified;
        next();
    } catch (error) {
        console.log(error);
        response = ResponseFormat.error({
            code: 400,
            messageText: "Invalid token",
            dataOut: null
        })
        return res.status(response.meta.code).json(response);
    }
}

module.exports = verifyToken;